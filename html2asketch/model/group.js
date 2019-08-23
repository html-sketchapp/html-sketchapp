import Base from './base';

class Group extends Base {
  constructor({x, y, width, height, id}) {
    super({id});
    this._class = 'group';
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
      'y': this._y,
    };

    obj.hasClickThrough = false;
    obj.clippingMaskMode = 0;
    obj.hasClippingMask = false;
    obj.windingRule = 1;

    return obj;
  }
}

export default Group;
