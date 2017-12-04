import {makeColorFill, makeColorFromCSS} from './helpers/utils';
import convertAngleToFromAndTo from './helpers/convertAngleToFromAndTo';

class Style {
  constructor({display, alignItems, justifyContent, overflowX, overflowY}) {
    this._fills = [];
    this._borders = [];
    this._shadows = [];
    this._innerShadows = [];

    this._display = display;
    this._alignItems = alignItems;
    this._justifyContent = justifyContent;

    this._overflowX = overflowX;
    this._overflowY = overflowY;
  }

  addColorFill(color, opacity) {
    this._backgroundColor = color;
    this._fills.push(makeColorFill(color, opacity));
  }

  addGradientFill({angle, stops}) {
    const {from, to} = convertAngleToFromAndTo(angle);

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

  addImageFill(href) {
    this._href = href;
  }

  addBorderRadius(borderRadius) {
    this._borderRadius = borderRadius;
  }

  addBorder(border) {
    this._border = border;
  }

  addShadow({color = '#000', blur = 1, offsetX = 0, offsetY = 0, spread = 0}) {
    this._boxShadow = {
      shadowOffset: {
        offsetX,
        offsetY
      },
      shadowRadius: blur,
      shadowSpread: spread,
      shadowColor: color
    };
  }

  toJSON() {
    return {
      _class: 'style',
      href: this._href,
      display: this._display,
      alignItems: this._alignItems,
      justifyContent: this._justifyContent,
      backgroundColor: this._backgroundColor,
      boxShadow: this._boxShadow,
      borderRadius: this._borderRadius,
      border: this._border
    };
  }
}

export default Style;
