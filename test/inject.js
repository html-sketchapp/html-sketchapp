import nodeToSketchLayers from '../html2asketch/nodeToSketchLayers';
import Page from '../html2asketch/page';

function flatten(arr) {
  return [].concat(...arr);
}

export default async function run(startNode) {
  const page = new Page({
    width: document.body.offsetWidth,
    height: document.body.offsetHeight
  });

  page.setName(document.title);

  const queue = [startNode];
  const promises = [];

  while (queue.length) {
    const node = queue.pop();

    promises.push(nodeToSketchLayers(node));

    Array.from(node.children).forEach(child => queue.push(child));
  }

  const arrayOfLayers = await Promise.all(promises);

  flatten(arrayOfLayers).forEach(layer => page.addLayer(layer));

  return page.toJSON();
}
