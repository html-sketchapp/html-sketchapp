import * as HtmlSketchApp from '..';

function flatten(arr) {
  return [].concat(...arr);
}

export async function layersJSON(startNode) {
  const page = new HtmlSketchApp.Page({
    width: document.body.offsetWidth,
    height: document.body.offsetHeight
  });

  page.setName(document.title);

  const queue = [startNode];
  const arrayOfLayers = [];

  while (queue.length) {
    const node = queue.pop();

    arrayOfLayers.push(HtmlSketchApp.nodeToSketchLayers(node));

    Array.from(node.children).forEach(child => queue.push(child));
  }

  flatten(arrayOfLayers).forEach(layer => page.addLayer(layer));

  return page.toJSON();
}

export async function pageJSON(startNode) {
  const page = HtmlSketchApp.nodeTreeToSketchPage(startNode, {
    addArtboard: true
  });

  return page.toJSON();
}
