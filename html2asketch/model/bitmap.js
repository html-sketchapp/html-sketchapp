import Base from './base';
import {generateID} from '../helpers/utils';

class Bitmap extends Base {
  constructor({url, x, y, width, height}) {
    super();
    this._class = 'bitmap';
    this._url = url;
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
      'x': this._x,
      'y': this._y,
      'height': this._height,
      'width': this._width
    };

    obj.image = {
      _class: 'MSJSONOriginalDataReference',
      _ref_class: 'MSImageData',
      _ref: `images/${generateID()}`,
      url: this._url
    };

    return obj;
  }
}

export default Bitmap;
