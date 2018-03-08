import {generateID} from './helpers/utils';

class Base {
  constructor() {
    this._layers = [];
    this._style = null;
    this._objectID = generateID();
    this._name = '';
    this._resizingConstant = 63;
  }

  setFixedWidthAndHeight() {
    this._resizingConstant = 12;
  }

  getID() {
    return this._objectID;
  }
  setID(_objectID) {
    this._objectID = _objectID;
  }

  setName(name) {
    this._name = name;
  }

  addLayer(layer) {
    this._layers.push(layer);
  }

  setStyle(style) {
    this._style = style;
  }

  toJSON(indexedParentID) {
    if (!this._class) {
      throw new Error('Class not set.');
    }

    const res = {
      '_class': this._class,
      'do_objectID': indexedParentID || this._name || this._objectID,
      'exportOptions': {
        '_class': 'exportOptions',
        'exportFormats': [],
        'includedLayerIds': [],
        'layerOptions': 0,
        'shouldTrim': false
      },
      'isFlippedHorizontal': false,
      'isFlippedVertical': false,
      'isLocked': false,
      'isVisible': true,
      'layerListExpandedType': 0,
      'name': this._name || this._class,
      'nameIsFixed': false,
      'resizingConstraint': this._resizingConstant,
      'resizingType': 0,
      'rotation': 0,
      'shouldBreakMaskChain': false,
      style: this._style ? this._style.toJSON() : undefined,
    };
    res.layers = this._layers.map((layer, i) => layer.toJSON(`${res.do_objectID}-${i}`))

    return res;
  }
}

export default Base;
