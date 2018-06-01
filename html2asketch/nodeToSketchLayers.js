import Rectangle from './model/rectangle';
import Bitmap from './model/bitmap';
import SVG from './model/svg';
import ShapeGroup from './model/shapeGroup';
import Group from './model/group';
import Style from './model/style';
import Text from './model/text';
import TextStyle from './model/textStyle';
import createXPathFromElement from './helpers/createXPathFromElement';
import {parseBackgroundImage} from './helpers/background';
import {getSVGString} from './helpers/svg';
import {getGroupBCR} from './helpers/bcr';
import {fixWhiteSpace} from './helpers/text';
import {isNodeVisible, isTextVisible} from './helpers/visibility';

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
      offsetX: parseInt(matches[2], 10),
      offsetY: parseInt(matches[3], 10),
      blur: parseInt(matches[4], 10),
      spread: parseInt(matches[5], 10)
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

function fixBorderRadius(borderRadius, width, height) {
  const matches = borderRadius.match(/^([0-9.]+)(.+)$/);

  // Sketch uses 'px' units for border radius, so we need to convert % to px
  if (matches && matches[2] === '%') {
    const baseVal = Math.max(width, height);
    const percentageApplied = baseVal * (parseInt(matches[1], 10) / 100);

    return Math.round(percentageApplied);
  }
  return parseInt(borderRadius, 10);
}

function isSVGDescendant(node) {
  return (node instanceof SVGElement) && node.matches('svg *');
}

export default function nodeToSketchLayers(node, options) {
  const layers = [];
  const bcr = node.getBoundingClientRect();
  const {left, top} = bcr;
  const width = bcr.right - bcr.left;
  const height = bcr.bottom - bcr.top;

  const styles = getComputedStyle(node);
  const {
    backgroundColor,
    backgroundImage,
    backgroundPositionX,
    backgroundPositionY,
    borderColor,
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
    textDecorationLine,
    textAlign,
    justifyContent,
    display,
    boxShadow,
    opacity,
    whiteSpace
  } = styles;

  // skip SVG child nodes as they are already covered by `new SVG(…)`
  if (isSVGDescendant(node)) {
    return layers;
  }

  if (!isNodeVisible(node, bcr, styles)) {
    return layers;
  }

  const shapeGroup = new ShapeGroup({x: left, y: top, width, height});

  if (options && options.getRectangleName) {
    shapeGroup.setName(options.getRectangleName(node));
  } else {
    shapeGroup.setName(createXPathFromElement(node));
  }

  const isImage = node.nodeName === 'IMG' && node.currentSrc;
  const isSVG = node.nodeName === 'svg';

  // if layer has no background/shadow/border/etc. skip it
  if (isImage || !hasOnlyDefaultStyles(styles)) {
    const style = new Style();

    if (backgroundColor) {
      style.addColorFill(backgroundColor);
    }

    if (isImage) {
      const absoluteUrl = new URL(node.currentSrc, location.href);

      style.addImageFill(absoluteUrl.href);
      shapeGroup.setFixedWidthAndHeight();
    }

    if (boxShadow !== DEFAULT_VALUES.boxShadow) {
      const shadowObj = shadowStringToObject(boxShadow);

      if (boxShadow.indexOf('inset') !== -1) {
        if (borderWidth.indexOf(' ') === -1) {
          shadowObj.spread += parseInt(borderWidth, 10);
        }
        style.addInnerShadow(shadowObj);
      } else {
        style.addShadow(shadowObj);
      }
    }

    // support for one-side borders (using inner shadow because Sketch doesn't support that)
    if (borderWidth.indexOf(' ') === -1) {
      style.addBorder({color: borderColor, thickness: parseInt(borderWidth, 10)});
    } else {
      if (borderTopWidth !== '0px') {
        style.addInnerShadow(shadowStringToObject(borderTopColor + ' 0px ' + borderTopWidth + ' 0px 0px inset'));
      }
      if (borderRightWidth !== '0px') {
        style.addInnerShadow(shadowStringToObject(borderRightColor + ' -' + borderRightWidth + ' 0px 0px 0px inset'));
      }
      if (borderBottomWidth !== '0px') {
        style.addInnerShadow(shadowStringToObject(borderBottomColor + ' 0px -' + borderBottomWidth + ' 0px 0px inset'));
      }
      if (borderLeftWidth !== '0px') {
        style.addInnerShadow(shadowStringToObject(borderLeftColor + ' ' + borderLeftWidth + ' 0px 0px 0px inset'));
      }
    }

    if (!options || options.layerOpacity !== false) {
      style.addOpacity(opacity);
    }

    shapeGroup.setStyle(style);

    //TODO borderRadius can be expressed in different formats and use various units - for simplicity we assume "X%"
    const cornerRadius = {
      topLeft: fixBorderRadius(borderTopLeftRadius, width, height),
      topRight: fixBorderRadius(borderTopRightRadius, width, height),
      bottomLeft: fixBorderRadius(borderBottomLeftRadius, width, height),
      bottomRight: fixBorderRadius(borderBottomRightRadius, width, height)
    };

    const rectangle = new Rectangle({width, height, cornerRadius});

    shapeGroup.addLayer(rectangle);

    // This should return a array when multiple background-images are supported
    const backgroundImageResult = parseBackgroundImage(backgroundImage);

    let layer = shapeGroup;

    if (backgroundImageResult) {

      switch (backgroundImageResult.type) {
        case 'Image': {
          const img = new Image();

          img.src = backgroundImageResult.value;

          const bitmapX = parseInt(backgroundPositionX, 10);
          const bitmapY = parseInt(backgroundPositionY, 10);

          if (bitmapX === 0 && bitmapY === 0 && img.width <= width && img.height <= height) {
            // background image fits entirely inside the node, so we can represent it with a (cheaper) image fill
            style.addImageFill(backgroundImageResult.value);
          } else {
            // use a Group(Shape + Bitmap) to correctly represent clipping of the background image
            const bm = new Bitmap({
              url: backgroundImageResult.value,
              x: bitmapX,
              y: bitmapY,
              width: img.width,
              height: img.height
            });

            bm.setName('background-image');
            shapeGroup.setHasClippingMask(true);

            const group = new Group({x: left, y: top, width, height});

            // position is relative to the group
            shapeGroup.setPosition({x: 0, y: 0});
            group.addLayer(shapeGroup);
            group.addLayer(bm);

            layer = group;
          }

          break;
        }
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

    layers.push(layer);
  }

  if (isSVG) {
    // sketch ignores padding and centerging as defined by viewBox and preserveAspectRatio when
    // importing SVG, so instead of using BCR of the SVG, we are using BCR of its children
    const childrenBCR = getGroupBCR(Array.from(node.children));
    const svgLayer = new SVG({
      x: childrenBCR.left,
      y: childrenBCR.top,
      width: childrenBCR.width,
      height: childrenBCR.height,
      rawSVGString: getSVGString(node)
    });

    layers.push(svgLayer);

    return layers;
  }

  if (!isTextVisible(styles)) {
    return layers;
  }

  const textStyle = new TextStyle({
    fontFamily,
    fontSize: parseInt(fontSize, 10),
    lineHeight: lineHeight !== 'normal' ? parseInt(lineHeight, 10) : undefined,
    letterSpacing: letterSpacing !== 'normal' ? parseFloat(letterSpacing) : undefined,
    fontWeight: parseInt(fontWeight, 10),
    color,
    textTransform,
    textDecoration: textDecorationLine,
    textAlign: display === 'flex' || display === 'inline-flex' ? justifyContent : textAlign,
    skipSystemFonts: options && options.skipSystemFonts
  });

  const rangeHelper = document.createRange();

  // Text
  Array.from(node.childNodes)
    .filter(child => child.nodeType === 3 && child.nodeValue.trim().length > 0)
    .forEach(textNode => {
      rangeHelper.selectNodeContents(textNode);
      const textRanges = Array.from(rangeHelper.getClientRects());
      const numberOfLines = textRanges.length;
      const textBCR = rangeHelper.getBoundingClientRect();
      const lineHeightInt = parseInt(lineHeight, 10);
      const textBCRHeight = textBCR.bottom - textBCR.top;
      let fixY = 0;

      // center text inside a box
      // TODO it's possible now in sketch - fix it!
      if (lineHeightInt && textBCRHeight !== lineHeightInt * numberOfLines) {
        fixY = (textBCRHeight - lineHeightInt * numberOfLines) / 2;
      }

      const textValue = fixWhiteSpace(textNode.nodeValue, whiteSpace);

      const text = new Text({
        x: textBCR.left,
        y: textBCR.top + fixY,
        width: textBCR.right - textBCR.left,
        height: textBCRHeight,
        text: textValue,
        style: textStyle,
        multiline: numberOfLines > 1
      });

      layers.push(text);
    });

  return layers;
}
