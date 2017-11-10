import {makeColorFill, makeImageFill, makeColorFromCSS} from './helpers/utils.js';

class Style {
  constructor() {
    this._fills = [];
    this._borders = [];
    this._shadows = [];
  }

  addColorFill(color) {
    this._fills.push(makeColorFill(color));
  }

  addGradientFill({angle, stops}) {
    // default 180deg
    const from = {x: 0.5, y: 0};
    const to = {x: 0.5, y: 1};

    // Learn math or find someone smarter to figure this out correctly
    switch (angle) {
      case 'to top':
      case '360deg':
      case '0deg':
        from.y = 1;
        to.y = 0;
        break;
      case 'to bottom':
      case '180deg':
        // keep default
        break;
      case 'to right':
      case '90deg':
        from.x = 0;
        from.y = 0.5;
        to.x = 1;
        to.y = 0.5;
        break;
      case 'to left':
      case '270deg':
        from.x = 1;
        from.y = 0.5;
        to.x = 0;
        to.y = 0.5;
        break;
      default:
        break;
    }

    this._fills.push({
      _class: 'fill',
      isEnabled: true,
      // Not sure why there is a color here
      color: {
        _class: 'color',
        alpha: 1,
        blue: 0.847,
        green: 0.847,
        red: 0.847
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
          position: index
        })),
        to: `{${to.x}, ${to.y}}`
      },
      noiseIndex: 0,
      noiseIntensity: 0,
      patternFillType: 1,
      patternTileScale: 1
    });
  }

  async addImageFill(image) {
    const fill = await makeImageFill(image);

    this._fills.push(fill);
  }

  addBorder({color, thickness}) {
    this._borders.push({
      _class: 'border',
      isEnabled: true,
      color: makeColorFromCSS(color),
      fillType: 0,
      position: 1,
      thickness
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
        opacity: 1
      },
      offsetX,
      offsetY,
      spread
    });
  }

  toJSON() {
    return {
      _class: 'style',
      fills: this._fills,
      borders: this._borders,
      shadows: this._shadows,
      endDecorationType: 0,
      miterLimit: 10,
      startDecorationType: 0
    };
  }
}

export default Style;
