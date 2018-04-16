import Base from './base';

class SymbolInstance extends Base {
  constructor({x, y, width, height, symbolID}) {
    super();
    this._class = 'symbolInstance';
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._symbolID = symbolID;
  }

  toJSON() {
    const obj = super.toJSON();

    obj.frame = {
      '_class': 'rect',
      'constrainProportions': false,
      'width': this._width,
      'height': this._height,
      'x': this._x,
      'y': this._y
    };

    obj.style = {
      '_class': 'style',
      'endDecorationType': 0,
      'miterLimit': 10,
      'startDecorationType': 0
    };

    obj.symbolID = this._symbolID;

    return obj;
  }
}

export default SymbolInstance;
