import Page from '../src/page.js';
import nodeToSketchLayers from '../src/nodeToSketchLayers.js';

const page = new Page({
  width: document.body.offsetWidth,
  height: document.body.offsetHeight
});

page.setName(document.title);

const waitingForLayers = Array.from(document.querySelectorAll('*')).map(nodeToSketchLayers);

Promise.all(waitingForLayers)
  .then(layers => {
    layers
      .reduce((prev, current) => prev.concat(current), [])//single node can produce multiple layers - lets concat them
      .forEach(layer => page.addLayer(layer));

    /* eslint-disable no-console */
    console.log(page.toJSON());
    /* eslint-enable no-console */
  });

