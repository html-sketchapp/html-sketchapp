import normalizeColor from 'normalize-css-color';
import {FillType} from 'sketch-constants';

// https://stackoverflow.com/a/20285053
const toDataURL = url => fetch(url, {mode: 'cors'})
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

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
export const makeColorFill = cssColor => ({
  _class: 'fill',
  isEnabled: true,
  color: makeColorFromCSS(cssColor),
  fillType: 0,
  noiseIndex: 0,
  noiseIntensity: 0,
  patternFillType: 1,
  patternTileScale: 1
});

// patternFillType - 0 1 2 3
export const makeImageFill = async(url, patternFillType = 1) => {
  let dataURL = '';

  if (url.indexOf('data:') === 0) {
    dataURL = url;
  } else {
    try {
      dataURL = await toDataURL(url);
    } catch (e) {
      console.error('Issue downloading ' + url + ' (' + e.message + ')');
    }
  }

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

  if (dataURL) {
    const imageData = dataURL.match(/data:.+;base64,(.+)/i);

    if(imageData && imageData[1]) {
      result.image.data = {_data: imageData[1]};
    } else {
      return null;
    }
  } else {
    result.image.url = url;
  }

  return result;
};
