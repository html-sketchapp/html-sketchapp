import {fromSJSONDictionary} from 'sketchapp-json-plugin';
import {fixTextLayer, fixSharedTextStyle} from './helpers/fixFont';
import fixImageFill from './helpers/fixImageFill';

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
  if (layer['_class'] === 'text') {
    fixTextLayer(layer);
  } else {
    fixImageFill(layer);
  }

  if (layer.layers) {
    layer.layers.forEach(fixLayer);
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

export default function(context) {
  const document = context.document;
  const page = document.currentPage();

  let asketchDocument = null;
  let asketchPage = null;

  const panel = NSOpenPanel.openPanel();

  panel.setCanChooseDirectories = false;
  panel.setCanChooseFiles = true;
  panel.setTitle = 'Choose a document file';
  panel.setPrompt = 'Choose';

  if (panel.runModal() === NSModalResponseOK) {
    const data = NSData.dataWithContentsOfURL(panel.URL());
    const content = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);

    asketchDocument = JSON.parse(content);
  }

  panel.setTitle = 'Choose a page file';

  if (panel.runModal() === NSModalResponseOK) {
    const data = NSData.dataWithContentsOfURL(panel.URL());
    const content = NSString.alloc().initWithData_encoding_(data, NSUTF8StringEncoding);

    asketchPage = JSON.parse(content);
  }

  removeSharedColors(document);
  removeSharedTextStyles(document);
  removeExistingLayers(page);

  if (asketchDocument) {
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
    page.name = asketchPage.name;

    asketchPage.layers.forEach(layer => {
      fixLayer(layer);
      page.addLayer(fromSJSONDictionary(layer));
    });

    console.log('Layers added: ' + asketchPage.layers.length);
  }
}
