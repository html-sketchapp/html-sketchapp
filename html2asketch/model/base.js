import {generateID, RESIZING_CONSTRAINTS, calculateResizingConstraintValue} from '../helpers/utils';

const DEFAULT_USER_INFO_SCOPE = 'html-sketchapp';

class Base {
  constructor({id} = {}) {
    this._class = null;
    this._layers = [];
    this._style = null;
    this._objectID = id || generateID();
    this._name = '';
    this._userInfo = null;
    this.setResizingConstraint(RESIZING_CONSTRAINTS.NONE);
    this.setHasClippingMask(false);
  }

  setFixedWidthAndHeight() {
    this.setResizingConstraint(RESIZING_CONSTRAINTS.WIDTH, RESIZING_CONSTRAINTS.HEIGHT);
  }

  setResizingConstraint(...constraints) {
    this._resizingConstraint = calculateResizingConstraintValue(...constraints);
  }

  getID() {
    return this._objectID;
  }

  setId(id) {
    this._objectID = id;
  }

  // scope defines which Sketch plugin will have access to provided data via Settings.setLayerSettingForKey
  // you should set it to the plugin ID e.g. "com.bohemiancoding.sketch.testplugin"
  // by default however we use "html-sketchapp" here which won't work directly with any plugin
  // but can still be accessed via native API: layer.userInfo()['html-sketchapp']
  setUserInfo(key, value, scope = DEFAULT_USER_INFO_SCOPE) {
    this._userInfo = this._userInfo || {};
    this._userInfo[scope] = this._userInfo[scope] || {};
    this._userInfo[scope][key] = value;
  }

  getUserInfo(key, scope = DEFAULT_USER_INFO_SCOPE) {
    return this._userInfo && this._userInfo[scope] && this._userInfo[scope][key];
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

  setHasClippingMask(hasClippingMask) {
    this._hasClippingMask = hasClippingMask;
  }

  toJSON() {
    if (!this._class) {
      throw new Error('Class not set.');
    }

    const result = {
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
      'resizingConstraint': this._resizingConstraint,
      'resizingType': 0,
      'rotation': 0,
      'shouldBreakMaskChain': false,
      'layers': this._layers.map(layer => layer.toJSON()),
      'clippingMaskMode': 0,
      'hasClippingMask': this._hasClippingMask
    };

    if (this._userInfo) {
      result.userInfo = this._userInfo;
    }

    if (this._style) {
      result.style = this._style.toJSON();
    }

    return result;
  }
}

export default Base;
