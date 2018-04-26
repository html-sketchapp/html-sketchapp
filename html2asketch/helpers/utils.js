import normalizeColor from 'normalize-css-color';
import {FillType} from 'sketch-constants';

const lut = [];

for (let i = 0; i < 256; i += 1) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

// http://stackoverflow.com/a/21963136
function e7() {
  const d0 = (Math.random() * 0xffffffff) | 0;
  const d1 = (Math.random() * 0xffffffff) | 0;
  const d2 = (Math.random() * 0xffffffff) | 0;
  const d3 = (Math.random() * 0xffffffff) | 0;

  return `${lut[d0 & 0xff] +
  lut[(d0 >> 8) & 0xff] +
  lut[(d0 >> 16) & 0xff] +
  lut[(d0 >> 24) & 0xff]}-${lut[d1 & 0xff]}${lut[(d1 >> 8) & 0xff]}-${lut[
    ((d1 >> 16) & 0x0f) | 0x40
  ]}${lut[(d1 >> 24) & 0xff]}-${lut[(d2 & 0x3f) | 0x80]}${lut[
    (d2 >> 8) & 0xff
  ]}-${lut[(d2 >> 16) & 0xff]}${lut[(d2 >> 24) & 0xff]}${lut[d3 & 0xff]}${lut[
    (d3 >> 8) & 0xff
  ]}${lut[(d3 >> 16) & 0xff]}${lut[(d3 >> 24) & 0xff]}`;
}

export function generateID() {
  return e7();
}

const safeToLower = input => {
  if (typeof input === 'string') {
    return input.toLowerCase();
  }

  return input;
};

// Takes colors as CSS hex, name, rgb, rgba, hsl or hsla
export const makeColorFromCSS = (input, alpha = 1) => {
  const nullableColor = normalizeColor(safeToLower(input));
  const colorInt = nullableColor === null ? 0x00000000 : nullableColor;
  const {r, g, b, a} = normalizeColor.rgba(colorInt);

  return {
    _class: 'color',
    red: r / 255,
    green: g / 255,
    blue: b / 255,
    alpha: a * alpha
  };
};

// Solid color fill
export const makeColorFill = (cssColor, alpha) => ({
  _class: 'fill',
  isEnabled: true,
  color: makeColorFromCSS(cssColor, alpha),
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1
});

// patternFillType - 0 1 2 3
export const makeImageFill = (url, patternFillType = 1) => {
  const result = {
    _class: 'fill',
    isEnabled: true,
    fillType: FillType.Pattern,
    image: {
      _class: 'MSJSONOriginalDataReference',
      _ref_class: 'MSImageData',
      _ref: `images/${generateID()}`
    },
    noiseIndex: 0,
    noiseIntensity: 0,
    patternFillType,
    patternTileScale: 1
  };

  if (url.indexOf('data:') === 0) {
    const imageData = url.match(/data:.+;base64,(.+)/i);

    if (imageData && imageData[1]) {
      result.image.data = {_data: imageData[1]};
    } else {
      return null;
    }
  } else {
    result.image.url = url;
  }

  return result;
};

const containsAllItems = (needles, haystack) => needles.every(needle => haystack.includes(needle));

export const calculateResizingConstraintValue = (...args) => {
  const noHeight =
    [RESIZING_CONSTRAINTS.TOP, RESIZING_CONSTRAINTS.BOTTOM, RESIZING_CONSTRAINTS.HEIGHT];
  const noWidth =
    [RESIZING_CONSTRAINTS.LEFT, RESIZING_CONSTRAINTS.RIGHT, RESIZING_CONSTRAINTS.WIDTH];
  const validValues = Object.values(RESIZING_CONSTRAINTS);

  if (!args.every(arg => validValues.includes(arg))) {
    throw new Error('Unknown resizing constraint');
  } else if (containsAllItems(noHeight, args)) {
    throw new Error('Can\'t fix height when top & bottom are fixed');
  } else if (containsAllItems(noWidth, args)) {
    throw new Error('Can\'t fix width when left & right are fixed');
  }

  return args.length > 0 ? args.reduce((acc, item) => acc & item, args[0]) : RESIZING_CONSTRAINTS.NONE;
};

export const RESIZING_CONSTRAINTS = {
  TOP: 31,
  RIGHT: 62,
  BOTTOM: 55,
  LEFT: 59,
  WIDTH: 61,
  HEIGHT: 47,
  NONE: 63
};
