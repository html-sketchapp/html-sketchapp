import UI from 'sketch/ui';
import {fromSJSONDictionary} from 'sketchapp-json-plugin';
import {fixTextLayer, fixSharedTextStyle} from './helpers/fixFont';
import fixImageFill from './helpers/fixImageFill';
import fixSVGLayer from './helpers/fixSVG';
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

function getNativeLayer(failingLayers, layer) {
  if (layer._class === 'text') {
    fixTextLayer(layer);
  } else if (layer._class === 'svg') {
    fixSVGLayer(layer);
  } else {
    fixImageFill(layer);
  }

  // Create native object for the current layer, ignore the children for now
  // this alows us to catch and ignore failing layers and finish the import
  const children = layer.layers;
  let nativeObj = null;

  layer.layers = [];

  try {
    nativeObj = fromSJSONDictionary(layer);
  } catch (e) {
    failingLayers.push(layer.name);

    console.log('Layer failed to import: ' + layer.name);
    return null;
  }

  // Get native object for all child layers and append them to the current object
  if (children && children.length) {
    children.forEach(child => {
      const nativeChild = getNativeLayer(failingLayers, child);

      if (nativeChild) {
        nativeObj.addLayer(nativeChild);
      }
    });
  }

  return nativeObj;
}

function removeSharedTextStyles(document) {
  document.documentData().layerTextStyles().setObjects([]);
}

function addSharedTextStyle(document, style) {
  const container = context.document.documentData().layerTextStyles();

  if (container.addSharedStyleWithName_firstInstance) {
    container.addSharedStyleWithName_firstInstance(style.name, fromSJSONDictionary(style.value));
  } else {
    // addSharedStyleWithName_firstInstance was removed in Sketch 50
    const s = MSSharedStyle.alloc().initWithName_firstInstance(style.name, fromSJSONDictionary(style.value));

    container.addSharedObject(s);
  }
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

    const failingLayers = [];

    asketchPage.layers
      .map(getNativeLayer.bind(null, failingLayers))
      .forEach(layer => layer && page.addLayer(layer));

    if (failingLayers.length === 1) {
      UI.alert('asketch2sketch', 'One layer couldn\'t be imported and was skipped.');
    } else if (failingLayers.length > 1) {
      UI.alert('asketch2sketch', `${failingLayers.length} layers couldn't be imported and were skipped.`);
    } else {
      const emojis = ['👌', '👍', '✨', '😍', '🍾', '🤩', '🎉', '👏', '💪', '🤘', '💅', '🏆', '🚀'];

      UI.message(`Import successful ${emojis[Math.floor(emojis.length * Math.random())]}`);
    }

    zoomToFit(context);
  }
}
