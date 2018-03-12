import createView from './createView';
import createImage from './createImage';
import createText from './createText';

export default function nodeToPrimitives(node, parentStyles={}) {
  if (node instanceof HTMLElement) {
    if (node.nodeName === 'IMG') {
      return createImage(node);
    }

    const styles = getComputedStyle(node);
    const view = createView(node, styles);

    if (!view) {
      return null;
    }

    view.children = Array.from(node.childNodes)
      .map(child => nodeToPrimitives(child, styles))
      .filter(child => child !== null);

    return view;
  } else if (node instanceof Text) {
    return createText(node, parentStyles);
  }

  return null;
}
