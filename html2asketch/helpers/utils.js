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
    alpha: a * alpha,
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
  patternTileScale: 1,
});

const ensureBase64DataURL = url => {
  const imageData = url.match(/data:(.+?)(;(.+))?,(.+)/i);

  if (imageData && imageData[3] !== 'base64') {
    // Solve for an NSURL bug that can't handle plaintext data: URLs
    const type = imageData[1];
    const data = decodeURIComponent(imageData[4]);
    const encodingMatch = imageData[3] && imageData[3].match(/^charset=(.*)/);
    let buffer;

    if (encodingMatch) {
      buffer = Buffer.from(data, encodingMatch[1]);
    } else {
      buffer = Buffer.from(data);
    }

    return `data:${type};base64,${buffer.toString('base64')}`;
  }

  return url;
};

// patternFillType - 0 1 2 3
export const makeImageFill = (url, patternFillType = 1) => ({
  _class: 'fill',
  isEnabled: true,
  fillType: FillType.Pattern,
  image: {
    _class: 'MSJSONOriginalDataReference',
    _ref_class: 'MSImageData',
    _ref: `images/${generateID()}`,
    url: url.indexOf('data:') === 0 ? ensureBase64DataURL(url) : url,
  },
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType,
  patternTileScale: 1,
});

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
  NONE: 63,
};

export const SMART_LAYOUT = {
  LEFT_TO_RIGHT: 'LEFT_TO_RIGHT',
  HORIZONTALLY_CENTER: 'HORIZONTALLY_CENTER',
  RIGHT_TO_LEFT: 'RIGHT_TO_LEFT',
  TOP_TO_BOTTOM: 'TOP_TO_BOTTOM',
  VERTICALLY_CENTER: 'VERTICALLY_CENTER',
  BOTTOM_TO_TOP: 'BOTTOM_TO_TOP',
};

export const DEFAULT_GROUP_LAYOUT = {
  _class: 'MSImmutableFreeformGroupLayout',
};

const smartLayoutBase = {
  _class: 'MSImmutableInferredGroupLayout',
};

const HORIZONTAL_AXIS = {
  axis: 0,
};

const VERTICAL_AXIS = {
  axis: 1,
};

export const getGroupLayout = layoutType => {
  switch (layoutType) {
    case SMART_LAYOUT.LEFT_TO_RIGHT: {
      return {...smartLayoutBase, ...HORIZONTAL_AXIS, layoutAnchor: 0};
    }

    case SMART_LAYOUT.HORIZONTALLY_CENTER: {
      return {...smartLayoutBase, ...HORIZONTAL_AXIS, layoutAnchor: 1};
    }

    case SMART_LAYOUT.RIGHT_TO_LEFT: {
      return {...smartLayoutBase, ...HORIZONTAL_AXIS, layoutAnchor: 2};
    }

    case SMART_LAYOUT.TOP_TO_BOTTOM: {
      return {...smartLayoutBase, ...VERTICAL_AXIS, layoutAnchor: 0};
    }

    case SMART_LAYOUT.VERTICALLY_CENTER: {
      return {...smartLayoutBase, ...VERTICAL_AXIS, layoutAnchor: 1};
    }

    case SMART_LAYOUT.BOTTOM_TO_TOP: {
      return {...smartLayoutBase, ...VERTICAL_AXIS, layoutAnchor: 2};
    }

    default:
      return DEFAULT_GROUP_LAYOUT;
  }
};
