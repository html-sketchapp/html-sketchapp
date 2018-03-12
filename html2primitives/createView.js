import createXPathFromElement from './helpers/createXPathFromElement';

const DEFAULT_VALUES = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  backgroundImage: 'none',
  borderWidth: '0px',
  boxShadow: 'none'
};

function hasOnlyDefaultStyles(styles) {
  return Object.keys(DEFAULT_VALUES).every(key => {
    const defaultValue = DEFAULT_VALUES[key];
    const value = styles[key];

    return defaultValue === value;
  });
}

function getName(node) {
  return createXPathFromElement(node);
}

function getFrame(node) {
  const bcr = node.getBoundingClientRect();
  const {width, height} = bcr;
  let {left, top} = bcr;

  // position depends on the current viewport, make the values absolute
  left += window.scrollX;
  top += window.scrollY;

  return {
    width,
    height,
    left,
    top
  };
}

function getStyles(styles) {
  const safelist = [
    'alignItems',
    'backgroundColor',
    'backgroundImage',
    'borderBottomColor',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomWidth',
    'borderLeftColor',
    'borderLeftWidth',
    'borderRightColor',
    'borderRightWidth',
    'borderTopColor',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopWidth',
    'borderWidth',
    'boxShadow',
    'clip',
    'display',
    'justifyContent',
    'opacity',
    'overflowX',
    'overflowY',
    'position',
    'visibility',
    'zIndex'
  ];
  const result = {};

  safelist.forEach(prop => result[prop] = styles[prop]);

  return result;
}

function isVisible(node, {width, height}, {
  position,
  overflowX,
  overflowY,
  opacity,
  visibility,
  display,
  clip,
  backgroundColor,
  backgroundImage,
  borderWidth,
  boxShadow
}) {
  if (node.tagName !== 'BODY' && node.offsetParent === null && position !== 'fixed') {
    return false;
  }

  if ((width === 0 || height === 0) && overflowX === 'hidden' && overflowY === 'hidden') {
    return false;
  }

  if (display === 'none' || visibility === 'hidden' || parseFloat(opacity) === 0) {
    return false;
  }

  if (clip === 'rect(0px 0px 0px 0px)' && position === 'absolute') {
    return false;
  }

  // it still can have interesting children, even though it's boring itself
  //if (hasOnlyDefaultStyles({backgroundColor, backgroundImage, borderWidth, boxShadow})) {
  //  return false;
  //}

  return true;
}

export default function createView(node, rawStyles) {
  const frame = getFrame(node);
  const styles = getStyles(rawStyles);

  if (!isVisible(node, frame, styles)) {
    return null;
  }

  return {
    type: 'view',
    name: getName(node),
    frame,
    styles
  };
}
