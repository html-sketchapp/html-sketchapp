import Base from './base';

class Page extends Base {
  constructor({width, height, id }) {
    super({ id });
    this._class = 'page';
    this._width = width;
    this._height = height;
  }

  toJSON() {
    const obj = super.toJSON();

    obj.frame = {
      '_class': 'rect',
      'constrainProportions': false,
      'height': this._width,
      'width': this._height,
      'x': 0,
      'y': 0
    };

    obj.style = {
      '_class': 'style',
      'endDecorationType': 0,
      'miterLimit': 10,
      'startDecorationType': 0
    };

    obj.horizontalRulerData = {
      '_class': 'rulerData',
      'base': 0,
      'guides': []
    };
    obj.verticalRulerData = {
      '_class': 'rulerData',
      'base': 0,
      'guides': []
    };

    obj.hasClickThrough = true;
    obj.includeInCloudUpload = true;

    return obj;
  }
}

export default Page;
