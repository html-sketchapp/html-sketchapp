import {generateID, makeColorFromCSS} from './helpers/utils.js';

function pageToPageReference(page) {
  return {
    '_class': 'MSJSONFileReference',
    '_ref_class': 'MSImmutablePage',
    '_ref': `pages/${page.getID()}`
  };
}

function textStyleToSharedStyle(textLayer) {
  return {
    '_class': 'sharedStyle',
    'do_objectID': generateID(),
    name: textLayer._name,
    'style': textLayer._style.toJSON()
  };
}

class Document {
  constructor() {
    this._objectID = generateID();
    this._colors = [];
    this._textStyles = [];
    this._pages = [];
  }

  setName(name) {
    this._name = name;
  }

  addPage(page) {
    this._pages.push(page);
  }

  addTextStyle(textLayer) {
    this._textStyles.push(textStyleToSharedStyle(textLayer));
  }

  addColor(color) {
    this._colors.push(makeColorFromCSS(color));
  }

  toJSON() {
    return {
      '_class': 'document',
      'do_objectID': this._objectID,
      'assets': {
        '_class': 'assetCollection',
        'colors': this._colors
      },
      'currentPageIndex': 0,
      'enableLayerInteraction': true,
      'enableSliceInteraction': true,
      'foreignSymbols': [],
      'layerStyles': {
        '_class': 'sharedStyleContainer',
        'objects': []
      },
      'layerSymbols': {
        '_class': 'symbolContainer',
        'objects': []
      },
      'layerTextStyles': {
        '_class': 'sharedTextStyleContainer',
        'objects': this._textStyles
      },
      'pages': this._pages.map(pageToPageReference)
    };
  }
}

export default Document;
