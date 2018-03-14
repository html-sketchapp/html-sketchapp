import nodeToSketchLayers from '../html2asketch/nodeToSketchLayers';

function flatten(arr) {
  return [].concat(...arr);
}

export default async function run(startNode) {
  const queue = [startNode];
  const promises = [];

  while (queue.length) {
    const node = queue.pop();

    promises.push(nodeToSketchLayers(node));

    Array.from(node.children).forEach(child => queue.push(child));
  }

  const arrayOfLayers = await Promise.all(promises);

  return flatten(arrayOfLayers);
}
