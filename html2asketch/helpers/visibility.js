
export function isVisible(node, {width, height} = node.getBoundingClientRect(), {
  position,
  overflowX,
  overflowY,
  opacity,
  visibility,
  display,
  clip
} = getComputedStyle(node)) {
  // Skip node when display is set to none for itself or an ancestor
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
  if (node.tagName !== 'BODY' && node.offsetParent === null && position !== 'fixed') {
    return false;
  }

  if ((width === 0 || height === 0) && overflowX === 'hidden' && overflowY === 'hidden') {
    return false;
  }

  if (display === 'none' || visibility === 'hidden' || parseFloat(opacity) === 0) {
    return false;
  }

  if (clip === 'rect(0px, 0px, 0px, 0px)' && position === 'absolute') {
    return false;
  }

  // node is detached from the DOM
  if (!document.contains(node)) {
    return false;
  }

  const parent = node.parentElement;

  if (
    parent &&
    parent.nodeName !== 'HTML' &&
    !isVisible(parent)
  ) {
    return false;
  }

  return true;
}
