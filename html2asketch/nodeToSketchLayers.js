import ShapeGroup from './shapeGroup.js';
import Rectange from './rectangle.js';
import createXPathFromElement from './helpers/createXPathFromElement.js';
import Style from './style.js';
import Text from './text.js';
import TextStyle from './textStyle.js';

const DEFAULT_VALUES = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none',
  borderWidth: '0px',
  boxShadow: 'none'
};

function shadowStringToObject(shadowStr) {
  let shadowObj = {};
  const matches = shadowStr.match(/^([a-z0-9#., ()]+) ([0-9.]+)px ([0-9.]+)px ([0-9.]+)px ([0-9.]+)px$/i);

  if (matches && matches.length === 6) {
    shadowObj = {
      color: matches[1],
      offsetX: matches[2],
      offsetY: matches[3],
      blur: matches[4],
      spread: matches[5]
    };
  }

  return shadowObj;
}

function hasOnlyDefaultStyles(styles) {
  return Object.keys(DEFAULT_VALUES).every(key => {
    const defaultValue = DEFAULT_VALUES[key];
    const value = styles[key];

    return defaultValue === value;
  });
}

function calculateBCRFromRanges(ranges) {
  let x = Infinity;
  let y = Infinity;
  let width = 0;
  let height = 0;

  ranges.forEach(range => {
    x = Math.min(x, range.x);
    y = Math.min(y, range.y);
  });

  ranges.forEach(range => {
    const normalizedWidth = range.width + (range.x - x);
    const normalizedHeight = range.height + (range.y - y);

    width = Math.max(width, normalizedWidth);
    height = Math.max(height, normalizedHeight);
  });

  return {x, y, width, height};
}

function fixBorderRadius(borderRadius) {
  const matches = borderRadius.match(/^([0-9.]+)(.+)$/);

  if (matches && matches[2] === '%') {
    const value = parseInt(matches[1], 10);

    // not sure about this, but border-radius: 50% should be fully rounded
    return value >= 50 ? 100 : value;
  }

  return parseInt(borderRadius, 10);
}

const BackgroundImageParser = {};

// Parse the background-image. The structure is as follows:
// (Supports images and gradients)
// ---
// <background-image> = <bg-image> [ , <bg-image> ]*
// <bg-image> = <image> | none
// <image> = <url> | <image-list> | <element-reference> | <image-combination> | <gradient>
// ---
// Source: https://www.w3.org/TR/css-backgrounds-3/#the-background-image
// ---
BackgroundImageParser.parse = async(style, value) => {
  if (value === DEFAULT_VALUES.backgroundImage) {
    return;
  }

  const urlMatches = value.match(/^url\("(.+)"\)$/i);
  const linearGradientMatches = value.match(/^linear-gradient\((.+)\)$/i);

  if (urlMatches && urlMatches.length === 2) {
    // Image
    await style.addImageFill(urlMatches[1]);
  } else if (linearGradientMatches && linearGradientMatches.length === 2) {
    // Linear gradient
    const linearGradientConfig = BackgroundImageParser.parseLinearGradient(linearGradientMatches[1]);

    if (linearGradientConfig) {
      style.addGradientFill(linearGradientConfig);
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
BackgroundImageParser.parseLinearGradient = value => {
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

export default async function nodeToSketchLayers(node) {
  const layers = [];
  const {width, height, x, y} = node.getBoundingClientRect();

  if (width === 0 || height === 0) {
    return layers;
  }

  const styles = getComputedStyle(node);
  const {
    backgroundColor,
    backgroundImage,
    borderColor,
    borderWidth,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight,
    letterSpacing,
    color,
    textTransform,
    textDecorationStyle,
    textAlign,
    justifyContent,
    display,
    boxShadow,
    visibility,
    opacity
  } = styles;

  if (display === 'none' || visibility === 'hidden' || parseFloat(opacity) === 0) {
    return layers;
  }

  const leaf = new ShapeGroup({x, y, width, height});
  const isImage = node.nodeName === 'IMG' && node.attributes.src;

  // if layer has no background/shadow/border/etc. skip it
  if (isImage || !hasOnlyDefaultStyles(styles)) {
    const style = new Style();

    if (backgroundColor) {
      style.addColorFill(backgroundColor);
    }

    if (isImage) {
      const absoluteUrl = new URL(node.attributes.src.value, location.href);

      await style.addImageFill(absoluteUrl.href);
      leaf.setFixedWidthAndHeight();
    }

    await BackgroundImageParser.parse(style, backgroundImage);

    style.addBorder({color: borderColor, thickness: parseInt(borderWidth, 10)});

    if (boxShadow !== DEFAULT_VALUES.boxShadow) {
      style.addShadow(shadowStringToObject(boxShadow));
    }

    leaf.setStyle(style);

    //TODO borderRadius can be expressed in different formats and use various units - for simplicity we assume "X%"
    const cornerRadius = {
      topLeft: fixBorderRadius(borderTopLeftRadius),
      topRight: fixBorderRadius(borderTopRightRadius),
      bottomLeft: fixBorderRadius(borderBottomLeftRadius),
      bottomRight: fixBorderRadius(borderBottomRightRadius)
    };

    const rectangle = new Rectange({width, height, cornerRadius});

    leaf.addLayer(rectangle);
    leaf.setName(createXPathFromElement(node));

    layers.push(leaf);
  }

  const textStyle = new TextStyle({
    fontFamily,
    fontSize: parseInt(fontSize, 10),
    lineHeight: parseInt(lineHeight, 10),
    letterSpacing: parseFloat(letterSpacing),
    fontWeight: parseInt(fontWeight, 10),
    color,
    textTransform,
    textDecoration: textDecorationStyle,
    textAlign: display === 'flex' || display === 'inline-flex' ? justifyContent : textAlign
  });

  const rangeHelper = document.createRange();

  // Text
  Array.from(node.childNodes)
    .filter(child => child.nodeType === 3 && child.nodeValue.trim().length > 0)
    .forEach(textNode => {
      rangeHelper.selectNodeContents(textNode);
      const textRanges = Array.from(rangeHelper.getClientRects());
      const numberOfLines = textRanges.length;
      const textBCR = calculateBCRFromRanges(textRanges);
      const lineHeightInt = parseInt(lineHeight, 10);
      let fixY = 0;

      // center text inside a box (it's possible in new sketch - fix it!)
      if (lineHeightInt && textBCR.height !== lineHeightInt * numberOfLines) {
        fixY = (textBCR.height - lineHeightInt * numberOfLines) / 2;
      }

      const text = new Text({
        x: textBCR.x,
        y: textBCR.y + fixY,
        width: textBCR.width,
        height: textBCR.height,
        text: textNode.nodeValue.trim(),
        style: textStyle,
        multiline: numberOfLines > 1
      });

      layers.push(text);
    });

  return layers;
}
