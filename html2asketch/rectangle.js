import Base from './base.js';

class Rectangle extends Base {
  constructor({width, height, cornerRadius = {topLeft: 0, bottomLeft: 0, topRight: 0, bottomRight: 0}}) {
    super();
    this._class = 'rectangle';
    this._width = width;
    this._height = height;
    this._cornerRadius = cornerRadius;
  }

  toJSON() {
    const obj = super.toJSON();

    obj.frame = {
      '_class': 'rect',
      'constrainProportions': false,
      'height': this._height,
      'width': this._width,
      'x': 0,
      'y': 0
    };

    obj.path = {
      '_class': 'path',
      'isClosed': true,
      'pointRadiusBehaviour': 1,
      'points': [
        {
          '_class': 'curvePoint',
          'cornerRadius': this._cornerRadius.topLeft,
          'curveFrom': '{0, 0}',
          'curveMode': 1,
          'curveTo': '{0, 0}',
          'hasCurveFrom': false,
          'hasCurveTo': false,
          'point': '{0, 0}'
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': this._cornerRadius.topRight,
          'curveFrom': '{1, 0}',
          'curveMode': 1,
          'curveTo': '{1, 0}',
          'hasCurveFrom': false,
          'hasCurveTo': false,
          'point': '{1, 0}'
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': this._cornerRadius.bottomRight,
          'curveFrom': '{1, 1}',
          'curveMode': 1,
          'curveTo': '{1, 1}',
          'hasCurveFrom': false,
          'hasCurveTo': false,
          'point': '{1, 1}'
        },
        {
          '_class': 'curvePoint',
          'cornerRadius': this._cornerRadius.bottomLeft,
          'curveFrom': '{0, 1}',
          'curveMode': 1,
          'curveTo': '{0, 1}',
          'hasCurveFrom': false,
          'hasCurveTo': false,
          'point': '{0, 1}'
        }
      ]
    };

    obj.hasConvertedToNewRoundCorners = true;
    obj.fixedRadius = 0;
    obj.edited = false;
    obj.booleanOperation = -1;

    return obj;
  }
}

export default Rectangle;
