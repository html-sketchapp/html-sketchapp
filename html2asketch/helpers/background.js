// Parses the background-image. The structure is as follows:
// (Supports images and gradients)
// ---
// <background-image> = <bg-image> [ , <bg-image> ]*
// <bg-image> = <image> | none
// <image> = <url> | <image-list> | <element-reference> | <image-combination> | <gradient>
// ---
// Source: https://www.w3.org/TR/css-backgrounds-3/#the-background-image
// ---
// These functions should be pure to make it easy
// to write test cases in the future.
const parseBackgroundImage = value => {
  if (value === 'none') {
    return;
  }

  const urlMatches = value.match(/^url\("(.+)"\)$/i);
  const linearGradientMatches = value.match(/^linear-gradient\((.+)\)$/i);

  if (urlMatches && urlMatches.length === 2) {
    // Image
    return {
      type: 'Image',
      value: urlMatches[1],
    };
  } else if (linearGradientMatches && linearGradientMatches.length === 2) {
    // Linear gradient
    const linearGradientConfig = parseLinearGradient(linearGradientMatches[1]);

    if (linearGradientConfig) {
      return {
        type: 'LinearGradient',
        value: linearGradientConfig,
      };
    }
  }
};

// Parser for a linear gradient:
// ---
// <linear-gradient> = linear-gradient(
//   [ [ <angle> | to <side-or-corner> ] ,]?
//   <color-stop>[, <color-stop>]+
// )
//
// <side-or-corner> = [left | right] || [top | bottom]
// ---
// Source: https://www.w3.org/TR/css3-images/#linear-gradients
// ---
// Example: "to top, rgba(67, 90, 111, 0.04), white"
const parseLinearGradient = value => {
  const parts = [];
  let currentPart = [];
  let i = 0;
  let skipComma = false;

  // There can be commas in colors, carefully break apart the value
  while (i < value.length) {
    const char = value.substr(i, 1);

    if (char === '(') {
      skipComma = true;
    } else if (char === ')') {
      skipComma = false;
    }

    if (char === ',' && !skipComma) {
      parts.push(currentPart.join('').trim());
      currentPart = [];
    } else {
      currentPart.push(char);
    }

    if (i === value.length - 1) {
      parts.push(currentPart.join('').trim());
    }
    i++;
  }

  if (parts.length === 2) {
    // Assume 2 color stops
    return {
      angle: '180deg',
      stops: [parts[0], parts[1]],
    };
  } else if (parts.length > 2) {
    // angle + n stops
    const [angle, ...stops] = parts;

    return {
      angle,
      stops,
    };
  }

  // Syntax is wrong
  return null;
};

/**
 * @param {string} backgroundSize value of background-size CSS property
 * @param {{width: number, height: number}} imageSize natural size of the image
 * @param {{width: number, height: number}} containerSize size of the container
 * @return {{width: number, height: number}} actual image size
 */
const getActualImageSize = (backgroundSize, imageSize, containerSize) => {
  let width, height;

  // sanity check
  if (imageSize.width === 0 || imageSize.height === 0 || containerSize.width === 0 || containerSize.height === 0) {
    width = 0;
    height = 0;
  } else if (backgroundSize === 'cover') {
    if (imageSize.width > imageSize.height) {
      height = containerSize.height;
      width = (height / imageSize.height) * imageSize.width;
    } else {
      width = containerSize.width;
      height = (width / imageSize.width) * imageSize.height;
    }
  } else if (backgroundSize === 'contain') {
    if (imageSize.width > imageSize.height) {
      width = containerSize.width;
      height = (width / imageSize.width) * imageSize.height;
    } else {
      height = containerSize.height;
      width = (height / imageSize.height) * imageSize.width;
    }
  } else if (backgroundSize === 'auto') {
    width = imageSize.width;
    height = imageSize.height;
  } else {
    // we currently don't support multiple backgrounds
    const [singleBackgroundSize] = backgroundSize.split(',');
    let [backgroundSizeWidth, backgroundSizeHeight] = singleBackgroundSize.trim().split(' ');

    if (backgroundSizeWidth === 'auto' || backgroundSizeWidth === undefined) {
      backgroundSizeWidth = null;
    } else if (backgroundSizeWidth.endsWith('%')) {
      backgroundSizeWidth = (parseFloat(backgroundSizeWidth) / 100) * containerSize.width;
    } else if (backgroundSizeWidth.endsWith('px')) {
      backgroundSizeWidth = parseFloat(backgroundSizeWidth);
    }

    if (backgroundSizeHeight === 'auto' || backgroundSizeHeight === undefined) {
      backgroundSizeHeight = null;
    } else if (backgroundSizeHeight.endsWith('%')) {
      backgroundSizeHeight = (parseFloat(backgroundSizeHeight) / 100) * containerSize.height;
    } else if (backgroundSizeHeight.endsWith('px')) {
      backgroundSizeHeight = parseFloat(backgroundSizeHeight);
    }

    if (backgroundSizeWidth !== null && backgroundSizeHeight === null) {
      width = backgroundSizeWidth;
      height = (width / imageSize.width) * imageSize.height;
    } else if (backgroundSizeWidth === null && backgroundSizeHeight !== null) {
      height = backgroundSizeHeight;
      width = (height / imageSize.height) * imageSize.width;
    } else if (backgroundSizeWidth !== null && backgroundSizeHeight !== null) {
      width = backgroundSizeWidth;
      height = backgroundSizeHeight;
    }
  }

  return {
    width,
    height,
  };
};

export {
  parseBackgroundImage,
  getActualImageSize,
};
