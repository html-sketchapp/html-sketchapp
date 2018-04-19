import Artboard from './model/artboard';
import Page from './model/page';
import nodeTreeToSketchGroup from './nodeTreeToSketchGroup';

export default function nodeTreeToSketchPage(node, options) {
  const rootGroup = nodeTreeToSketchGroup(node, options);

  const bcr = node.getBoundingClientRect();
  const page = new Page({
    width: bcr.right - bcr.left,
    height: bcr.bottom - bcr.top
  });

  if (options && options.addArtboard) {
    const artboard = new Artboard({
      x: rootGroup._x,
      y: rootGroup._y,
      width: rootGroup._width,
      height: rootGroup._height
    });

    artboard.addLayer(rootGroup);

    if (options.artboardName) {
      artboard.setName(options.artboardName);
    }

    page.addLayer(artboard);
  } else {
    page.addLayer(rootGroup);
  }

  if (options.pageName) {
    page.setName(options.pageName);
  }

  return page;
}
