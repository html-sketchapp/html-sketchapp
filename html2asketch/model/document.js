import {generateID, makeColorFromCSS} from '../helpers/utils';

function pageToPageReference(page) {
  return {
    '_class': 'MSJSONFileReference',
    '_ref_class': 'MSImmutablePage',
    '_ref': `pages/${page.getID()}`
  };
}

function layerToSharedStyle(layer, id) {
  return {
    '_class': 'sharedStyle',
    'do_objectID': id || generateID(),
    name: layer._name,
    'style': layer._style.toJSON()
  };
}

class Document {
  constructor() {
    this._objectID = generateID();
    this._colors = [];
    this._textStyles = [];
    this._layerStyles = [];
    this._pages = [];
  }

  setName(name) {
    this._name = name;
  }

  setObjectID(id) {
    this._objectID = id;
  }

  addPage(page) {
    this._pages.push(page);
  }

  addTextStyle(textLayer, id) {
    this._textStyles.push(layerToSharedStyle(textLayer, id));
  }

  addLayerStyle(layer, id) {
    this._layerStyles.push(layerToSharedStyle(layer, id));
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
        'objects': this._layerStyles
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
