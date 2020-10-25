import {makeColorFill, makeImageFill, makeColorFromCSS} from '../helpers/utils';
import convertAngleToFromAndTo from '../helpers/convertAngleToFromAndTo';

class Style {
  constructor() {
    this._fills = [];
    this._borders = [];
    this._shadows = [];
    this._innerShadows = [];
    this._opacity = '1';
  }

  addColorFill(color, opacity) {
    this._fills.push(makeColorFill(color, opacity));
  }

  addGradientFill({angle, stops}, width, height) {
    // width and height stand for trimmed 2d canvas of any polygon to fill gradient with
    const {from, to} = convertAngleToFromAndTo(angle, width, height);

    this._fills.push({
      _class: 'fill',
      isEnabled: true,
      // Not sure why there is a color here
      color: {
        _class: 'color',
        alpha: 1,
        blue: 0.847,
        green: 0.847,
        red: 0.847,
      },
      fillType: 1,
      gradient: {
        _class: 'gradient',
        elipseLength: 0,
        from: `{${from.x}, ${from.y}`,
        gradientType: 0,
        shouldSmoothenOpacity: false,
        stops: stops.map((stopColor, index) => ({
          _class: 'gradientStop',
          color: makeColorFromCSS(stopColor),
          position: index,
        })),
        to: `{${to.x}, ${to.y}}`,
      },
      noiseIndex: 0,
      noiseIntensity: 0,
      patternFillType: 1,
      patternTileScale: 1,
    });
  }

  addImageFill(image) {
    const fill = makeImageFill(image);

    this._fills.push(fill);
  }

  addBorder({color, thickness}) {
    this._borders.push({
      _class: 'border',
      isEnabled: true,
      color: makeColorFromCSS(color),
      fillType: 0,
      position: 1,
      thickness,
    });
  }

  addShadow({color = '#000', blur = 1, offsetX = 0, offsetY = 0, spread = 0}) {
    this._shadows.push({
      _class: 'shadow',
      isEnabled: true,
      blurRadius: blur,
      color: makeColorFromCSS(color),
      contextSettings: {
        _class: 'graphicsContextSettings',
        blendMode: 0,
        opacity: 1,
      },
      offsetX,
      offsetY,
      spread,
    });
  }

  addInnerShadow({color = '#000', blur = 0, offsetX = 0, offsetY = 0, spread = 0}) {
    this._innerShadows.push({
      _class: 'innerShadow',
      isEnabled: true,
      blurRadius: blur,
      color: makeColorFromCSS(color),
      contextSettings: {
        _class: 'graphicsContextSettings',
        blendMode: 0,
        opacity: 1,
      },
      offsetX,
      offsetY,
      spread,
    });
  }

  addOpacity(opacity) {
    this._opacity = opacity;
  }

  toJSON() {
    return {
      _class: 'style',
      fills: this._fills,
      borders: this._borders,
      shadows: this._shadows,
      innerShadows: this._innerShadows,
      endDecorationType: 0,
      miterLimit: 10,
      startDecorationType: 0,
      contextSettings: {
        _class: 'graphicsContextSettings',
        blendMode: 0,
        opacity: this._opacity,
      },
    };
  }
}

export default Style;
