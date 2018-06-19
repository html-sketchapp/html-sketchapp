const path = require('path');

module.exports = function removeRandomness(layer) {
  if (layer.do_objectID) {
    layer.do_objectID = 'pizza';
  }

  if (layer.image) {
    if (layer.image._ref) {
      layer.image._ref = 'images/haribo';
    }

    if (layer.image.url) {
      layer.image.url = path.basename(layer.image.url);
    }
  }

  // for some reason only width differs between local and travis
  if (layer.frame && layer.frame.width) {
    layer.frame.width = Math.floor(layer.frame.width);
  }

  // we need to go deeper

  if (layer.style && layer.style.fills) {
    layer.style.fills.forEach(removeRandomness);
  }

  if (layer.layers) {
    layer.layers.forEach(removeRandomness);
  }
};
