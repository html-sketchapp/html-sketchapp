import Base from './base';

class ShapeGroup extends Base {
  constructor({x, y, width, height}) {
    super();
    this._class = 'shapeGroup';
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  toJSON() {
    const obj = super.toJSON();

    obj.frame = {
      '_class': 'rect',
      'constrainProportions': false,
      'height': this._height,
      'width': this._width,
      'x': this._x,
      'y': this._y
    };
    obj.x = this._x;
    obj.y = this._y;
    obj.height = this._height;
    obj.width = this._width;
    obj.hasClickThrough = false;
    obj.clippingMaskMode = 0;
    obj.hasClippingMask = false;
    obj.windingRule = 1;

    return obj;
  }
}

export default ShapeGroup;
