import {makeColorFill, makeImageFill, makeColorFromCSS} from './helpers/utils.js';

class Style {
  constructor() {
    this._fills = [];
    this._borders = [];
    this._shadows = [];
    this._innerShadows = [];
  }

  addColorFill(color) {
    this._fills.push(makeColorFill(color));
  }

  async addImageFill(image) {
    const fill = await makeImageFill(image);

    this._fills.push(fill);
  }

  addBorder({color, thickness}) {
    this._borders.push({
      '_class': 'border',
      'isEnabled': true,
      'color': makeColorFromCSS(color),
      'fillType': 0,
      'position': 1,
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

  addInnerShadow({color = '#000', blur = 1, offsetX = 0, offsetY = 0, spread = 0}) {
    this._innerShadows.push({
      _class: 'innerShadow',
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
      '_class': 'style',
      'fills': this._fills,
      'borders': this._borders,
      'shadows': this._shadows,
      'innerShadows': this._innerShadows,
      'endDecorationType': 0,
      'miterLimit': 10,
      'startDecorationType': 0
    };
  }
}

export default Style;
