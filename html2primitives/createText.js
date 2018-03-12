function getStyles(styles) {
  const safelist = [
    'fontFamily',
    'fontSize',
    'lineHeight',
    'letterSpacing',
    'fontWeight',
    'color',
    'textTransform',
    'textDecoration',
    'textAlign'
  ];
  const result = {};

  safelist.forEach(prop => result[prop] = styles[prop]);

  return result;
}

function calculateBCRFromRanges(ranges) {
  let left = Infinity;
  let top = Infinity;
  let width = 0;
  let height = 0;

  ranges.forEach(range => {
    left = Math.min(left, range.x);
    top = Math.min(top, range.y);
  });

  ranges.forEach(range => {
    const normalizedWidth = range.width + (range.x - left);
    const normalizedHeight = range.height + (range.y - top);

    width = Math.max(width, normalizedWidth);
    height = Math.max(height, normalizedHeight);
  });

  return {left, top, width, height};
}

function getFrame(node) {
  const rangeHelper = document.createRange();

  rangeHelper.selectNode(node);
  const textRanges = Array.from(rangeHelper.getClientRects());
  const textBCR = calculateBCRFromRanges(textRanges);

  return {
    width: Math.ceil(textBCR.width),
    height: Math.ceil(textBCR.height),
    left: textBCR.left,
    top: textBCR.top
  };
}

function getContent(node) {
  return node.nodeValue.trim();
}

function isVisible(content, {width, height}) {
  if (content.length === 0) {
    return false;
  }

  if (width === 0 || height === 0) {
    return false;
  }

  return true;
}

export default function createText(node, rawStyles) {
  const content = getContent(node);
  const frame = getFrame(node);
  const styles = getStyles(rawStyles);

  if (!isVisible(content, frame)) {
    return null;
  }

  return {
    type: 'text',
    name: content,
    content,
    frame,
    styles
  };
}
