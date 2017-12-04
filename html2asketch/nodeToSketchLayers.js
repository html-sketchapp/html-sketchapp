import ShapeGroup from './shapeGroup';
import createXPathFromElement from './helpers/createXPathFromElement';
import Style from './style';
import Text from './text';
import TextStyle from './textStyle';
import {parseBackgroundImage} from './helpers/background';

const DEFAULT_VALUES = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none',
  borderWidth: '0px',
  boxShadow: 'none'
};

function shadowStringToObject(shadowStr) {
  let shadowObj = {};
  const matches =
    shadowStr.match(/^([a-z0-9#., ()]+) ([-]?[0-9.]+)px ([-]?[0-9.]+)px ([-]?[0-9.]+)px ([-]?[0-9.]+)px ?(inset)?$/i);

  if (matches && matches.length === 7) {
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

export default async function nodeToSketchLayers(node) {
  const layers = [];
  const {width, height, x, y} = node.getBoundingClientRect();

  const styles = getComputedStyle(node);
  const {
    alignItems,
    backgroundColor,
    backgroundImage,
    borderWidth,
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderTopColor,
    borderRightColor,
    borderBottomColor,
    borderLeftColor,
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
    opacity,
    overflowX,
    overflowY,
    position
  } = styles;

  // Skip node when display is set to none for itself or an ancestor
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  if (node.offsetParent === null && position !== 'fixed') {
    return layers;
  }

  if ((width === 0 || height === 0) && overflowX === 'hidden' && overflowY === 'hidden') {
    return layers;
  }

  if (display === 'none' || visibility === 'hidden' || parseFloat(opacity) === 0) {
    return layers;
  }

  const leaf = new ShapeGroup({x, y, width, height});
  const isImage = node.nodeName === 'IMG' && node.attributes.src;

  // if layer has no background/shadow/border/etc. skip it
  if (isImage || !hasOnlyDefaultStyles(styles)) {
    const style = new Style({display, justifyContent, alignItems, overflowX, overflowY});

    if (backgroundColor) {
      style.addColorFill(backgroundColor);
    }

    if (isImage) {
      const absoluteUrl = new URL(node.attributes.src.value, location.href);

      style.addImageFill(absoluteUrl.href);
      leaf.setFixedWidthAndHeight();
    }

    // This should return a array when multiple background-images are supported
    const backgroundImageResult = parseBackgroundImage(backgroundImage);

    if (backgroundImageResult) {
      switch (backgroundImageResult.type) {
        case 'Image':
          style.addImageFill(backgroundImageResult.value);
          break;
        case 'LinearGradient':
          style.addGradientFill(backgroundImageResult.value);
          break;
        default:
          // Unsupported types:
          // - radial gradient
          // - multiple background-image
          break;
      }
    }

    if (boxShadow !== DEFAULT_VALUES.boxShadow) {
      const shadowObj = shadowStringToObject(boxShadow);

      if (boxShadow.indexOf('inset') !== -1) {
        if (borderWidth.indexOf(' ') === -1) {
          shadowObj.spread += parseInt(borderWidth, 10);
        }
        style.addShadow(shadowObj);
      } else {
        style.addShadow(shadowObj);
      }
    }

    style.addBorder({
      borderTopColor,
      borderTopWidth: parseInt(borderTopWidth),
      borderRightColor,
      borderRightWidth: parseInt(borderRightWidth),
      borderBottomColor,
      borderBottomWidth: parseInt(borderBottomWidth),
      borderLeftColor,
      borderLeftWidth: parseInt(borderLeftWidth)
    });

    style.addBorderRadius({
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius
    });

    leaf.setStyle(style);
    leaf.setName(createXPathFromElement(node));
    layers.push(leaf);
  }

  // Text
  Array.from(node.childNodes)
    .filter(child => child.nodeType === 3 && child.nodeValue.trim().length > 0)
    .forEach(textNode => {
      const rangeHelper = document.createRange();

      rangeHelper.selectNode(textNode);
      const textRanges = Array.from(rangeHelper.getClientRects());
      const textBCR = calculateBCRFromRanges(textRanges);
      const textStyle = new TextStyle({
        fontFamily,
        fontSize: parseInt(fontSize, 10),
        lineHeight: lineHeight !== 'normal' ? parseInt(lineHeight, 10) : undefined,
        letterSpacing: letterSpacing !== 'normal' ? parseFloat(letterSpacing) : undefined,
        fontWeight: parseInt(fontWeight, 10),
        color,
        textTransform,
        textDecoration: textDecorationStyle,
        width: Math.ceil(textBCR.width),
        height: Math.ceil(textBCR.height),
        textAlign
      });

      const numberOfLines = textRanges.length;
      const lineHeightInt = parseInt(lineHeight, 10);
      let fixY = 0;

      // center text inside a box
      // TODO it's possible now in sketch - fix it!
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
