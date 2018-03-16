import {fromSJSONDictionary} from 'sketchapp-json-plugin';
import {fixTextLayer, fixSharedTextStyle} from './helpers/fixFont';
import fixImageFill from './helpers/fixImageFill';
import fixSVGLayer from './helpers/fixSVG';
import showDialog from './helpers/showDialog';
import zoomToFit from './helpers/zoomToFit';

function removeExistingLayers(context) {
  if (context.containsLayers()) {
    const loop = context.children().objectEnumerator();
    let currLayer = loop.nextObject();

    while (currLayer) {
      if (currLayer !== context) {
        currLayer.removeFromParent();
      }
      currLayer = loop.nextObject();
    }
  }
}

function fixLayer(layer) {
  if (layer._class === 'text') {
    fixTextLayer(layer);
  } else if (layer._class === 'svg') {
    fixSVGLayer(layer);
    return;
  } else {
    fixImageFill(layer);
  }

  if (layer.layers) {
    layer.layers.forEach(fixLayer);
  }
}

function getNativeLayer(layer) {
  fixLayer(layer);

  try {
    return fromSJSONDictionary(layer);
  } catch (e) {
    throw new Error('Layer decoding failed - ' + e);
  }
}

function removeSharedTextStyles(document) {
  document.documentData().layerTextStyles().setObjects([]);
}

function addSharedTextStyle(document, style) {
  const textStyles = document.documentData().layerTextStyles();

  textStyles.addSharedStyleWithName_firstInstance(style.name, fromSJSONDictionary(style.value));
}

function removeSharedColors(document) {
  const assets = document.documentData().assets();

  assets.removeAllColors();
}

function addSharedColor(document, colorJSON) {
  const assets = document.documentData().assets();
  const color = fromSJSONDictionary(colorJSON);

  assets.addColor(color);
}

export default function asketch2sketch(context) {
  const document = context.document;
  const page = document.currentPage();

  let asketchDocument = null;
  let asketchPage = null;

  const panel = NSOpenPanel.openPanel();

  panel.setCanChooseDirectories(false);
  panel.setCanChooseFiles(true);
  panel.setAllowsMultipleSelection(true);
  panel.setTitle('Choose *.asketch.json files');
  panel.setPrompt('Choose');
  panel.setAllowedFileTypes(['json']);

  if (panel.runModal() !== NSModalResponseOK || panel.URLs().length === 0) {
    return;
  }

  const urls = panel.URLs();

  urls.forEach(url => {
    const data = NSData.dataWithContentsOfURL(url);
    const content = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);

    let asketchFile = null;

    try {
      asketchFile = JSON.parse(content);
    } catch (e) {
      const alert = NSAlert.alloc().init();

      alert.setMessageText('File is not a valid JSON.');
      alert.runModal();
    }

    if (asketchFile && asketchFile._class === 'document') {
      asketchDocument = asketchFile;
    } else if (asketchFile && asketchFile._class === 'page') {
      asketchPage = asketchFile;
    }
  });

  if (asketchDocument) {
    removeSharedColors(document);
    removeSharedTextStyles(document);

    if (asketchDocument.assets.colors) {
      asketchDocument.assets.colors.forEach(color => addSharedColor(document, color));

      console.log('Shared colors added: ' + asketchDocument.assets.colors.length);
    }

    if (asketchDocument.layerTextStyles && asketchDocument.layerTextStyles.objects) {
      asketchDocument.layerTextStyles.objects.forEach(style => {
        fixSharedTextStyle(style);
        addSharedTextStyle(document, style);
      });

      console.log('Shared text styles added: ' + asketchDocument.layerTextStyles.objects.length);
    }
  }

  if (asketchPage) {
    removeExistingLayers(page);

    page.name = asketchPage.name;

    let failedLayers = 0;

    asketchPage.layers.forEach(layer => {
      try {
        const nativeLayer = getNativeLayer(layer);

        page.addLayer(nativeLayer);
      } catch (e) {
        failedLayers++;
        console.log('Layer couldn\'t be created: ' + layer.name, e);
      }
    });

    if (failedLayers === 1) {
      showDialog('One layer couldn\'t be imported and was skipped.');
    } else if (failedLayers > 1) {
      showDialog(`${failedLayers} layers couldn't be imported and were skipped.`);
    }

    zoomToFit(context);
  }
}
