import Base from './base';

class ShapeGroup extends Base {
  constructor({x, y, width, height}) {
    super();
    this._class = 'shapeGroup';
    this._width = width;
    this._height = height;
    this.setPosition({x, y});
  }

  setPosition({x, y}) {
    this._x = x;
    this._y = y;
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

    obj.hasClickThrough = false;
    obj.windingRule = 1;

    return obj;
  }
}

export default ShapeGroup;
