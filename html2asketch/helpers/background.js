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
      value: urlMatches[1]
    };
  } else if (linearGradientMatches && linearGradientMatches.length === 2) {
    // Linear gradient
    const linearGradientConfig = parseLinearGradient(linearGradientMatches[1]);

    if (linearGradientConfig) {
      return {
        type: 'LinearGradient',
        value: linearGradientConfig
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
      stops: [parts[0], parts[1]]
    };
  } else if (parts.length > 2) {
    // angle + n stops
    const [angle, ...stops] = parts;

    return {
      angle,
      stops
    };
  }

  // Syntax is wrong
  return null;
};

async function toImageObj(url) {
  const imageObj = new Image();

  if (url.indexOf('data:') !== 0) {
    url += '?cache';
  }

  imageObj.crossOrigin = 'anonymous';
  await new Promise((resolve, reject) => {
    imageObj.src = url;
    imageObj.onload = resolve;
    imageObj.onerror = reject;
  });

  return imageObj;
}

async function fixBackgroundImage(url, width, height, backgroundSize, backgroundPosition, backgroundRepeat) {
  let imageObj = await toImageObj(url).catch(e => {console.error(e);});
  let imageData = url;

  if (imageObj) {
    const imageW = imageObj.naturalWidth;
    const imageH = imageObj.naturalHeight;
    let x, y, w, h;

    if (backgroundSize === 'cover' && imageW >= imageH || backgroundSize === 'contain' && imageW < imageH) {
      w = imageW * height / imageH;
      h = height;
    } else if (backgroundSize === 'cover' && imageW < imageH || backgroundSize === 'contain' && imageW >= imageH) {
      w = width;
      h = imageH * width / imageW;
    } else if (backgroundSize === 'auto') {
      w = imageW;
      h = imageH;
    } else {
      const backgroundSizeMatches = backgroundSize.match(/([-]?[0-9.]+)([^ ]+)? ?(?:([-]?[0-9.]+)([^ ])?)?/i);

      if (backgroundSizeMatches) {
        switch (backgroundSizeMatches[2]) {
          case 'px':
            w = backgroundSizeMatches[1];
            break;
          case '%':
            w = width / 100 * backgroundSizeMatches[1];
            break;
          default:
            w = 0;
        }
        switch (backgroundSizeMatches[4]) {
          case 'px':
            h = backgroundSizeMatches[3];
            break;
          case '%':
            h = height / 100 * backgroundSizeMatches[3];
            break;
          default:
            h = imageH * w / imageW;
        }
      }
    }

    const backgroundPositionMatches = backgroundPosition.match(/([-]?[0-9.]+)([^ ]+)? ([-]?[0-9.]+)([^ ]+)?/i);

    if (backgroundPositionMatches) {
      switch (backgroundPositionMatches[2]) {
        case 'px':
          x = backgroundPositionMatches[1];
          break;
        case '%':
          x = (width - w) / 100 * backgroundPositionMatches[1];
          break;
        default:
          x = 0;
      }
      switch (backgroundPositionMatches[4]) {
        case 'px':
          y = backgroundPositionMatches[3];
          break;
        case '%':
          y = (height - h) / 100 * backgroundPositionMatches[3];
          break;
        default:
          y = 0;
      }
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (backgroundRepeat !== 'no-repeat') {
      // draw patternSource;
      canvas.width = w;
      canvas.height = h;
      context.drawImage(imageObj, 0, 0, imageW, imageH, 0, 0, w, h);
      imageObj = await toImageObj(canvas.toDataURL('image/png')).catch(e => {console.error(e);});

      // draw pattern;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const patternWidth = x >= 0 ? width + x - Math.ceil(x / w) * w : width - x;
      const patternHeight = y >= 0 ? height + y - Math.ceil(y / h) * h : height - y;

      canvas.width = patternWidth;
      canvas.height = patternHeight;
      const pattern = context.createPattern(imageObj, backgroundRepeat);

      context.fillStyle = pattern;
      context.fillRect(0, 0, patternWidth, patternHeight);

      imageObj = await toImageObj(canvas.toDataURL('image/png')).catch(e => {console.error(e);});

      // draw background image;
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = width;
      canvas.height = height;
      const patternX = x >= 0 && backgroundRepeat !== 'repeat-y' ? x - Math.ceil(x / w) * w : x;
      const patternY = y >= 0 && backgroundRepeat !== 'repeat-x' ? y - Math.ceil(y / h) * h : y;

      context.drawImage(
        imageObj,
        0,
        0,
        imageObj.naturalWidth,
        imageObj.naturalHeight,
        patternX,
        patternY,
        imageObj.naturalWidth,
        imageObj.naturalHeight
      );
    } else {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(imageObj, 0, 0, imageW, imageH, x, y, w, h);
    }
    imageData = canvas.toDataURL('image/png');
  }

  return imageData;
}

export {
  parseBackgroundImage,
  fixBackgroundImage
};
