import {generateID, RESIZING_CONSTRAINTS, calculateResizingConstraintValue} from '../helpers/utils';

const DEFAULT_USER_INFO_SCOPE = 'html-sketchapp';

class Base {
  constructor() {
    this._class = null;
    this._layers = [];
    this._style = null;
    this._objectID = generateID();
    this._name = '';
    this._userInfo = null;
    this.setResizingConstraint(RESIZING_CONSTRAINTS.NONE);
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
      'resizingConstraint': this._resizingConstraint,
      'resizingType': 0,
      'rotation': 0,
      'shouldBreakMaskChain': false,
      userInfo: this._userInfo ? this._userInfo : undefined,
      style: this._style ? this._style.toJSON() : undefined,
      layers: this._layers.map(layer => layer.toJSON())
    };
  }
}

export default Base;
