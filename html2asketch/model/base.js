import {generateID, resizingConstraintValues} from '../helpers/utils';

class Base {
  constructor() {
    this._class = null;
    this._layers = [];
    this._style = null;
    this._objectID = generateID();
    this._name = '';
    this.setResizingConstraints('none');
  }

  setFixedWidthAndHeight() {
    this.setResizingConstraints('width', 'height');
  }

  setResizingConstraints(first, ...rest) {
    const rCV = resizingConstraintValues;

    return this._resizingConstant = rest.reduce((acc, item) => acc & rCV[item], rCV[first]);
  }

  getID() {
    return this._objectID;
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

  toJSON() {
    if (!this._class) {
      throw new Error('Class not set.');
    }

    return {
      '_class': this._class,
      'do_objectID': this._objectID,
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
      'resizesContent': this._resizingConstant === resizingConstraintValues.none ? 0 : 1,
      'resizingConstraint': this._resizingConstant,
      'resizingType': 0,
      'rotation': 0,
      'shouldBreakMaskChain': false,
      style: this._style ? this._style.toJSON() : undefined,
      layers: this._layers.map(layer => layer.toJSON())
    };
  }
}

export default Base;
