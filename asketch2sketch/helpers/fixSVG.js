import {toSJSON} from 'sketchapp-json-plugin';
import {replaceProperties} from './utils';

function makeNativeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  let svgLayer = null;

  try {
    svgImporter.prepareToImportFromData(svgData);
    svgLayer = svgImporter.importAsLayer();
  } catch (e) {
    console.log('SVG import failed: ' + e);
  }

  if (svgLayer === null) {
    return null;
  }

  while (svgLayer && svgLayer.layers && svgLayer.layers().length === 1 && svgLayer.class() instanceof MSLayerGroup) {
    svgLayer = svgLayer.layers()[0];
  }

  svgLayer.resizingConstraint = layer.resizingConstraint;
  svgLayer.hasClippingMask = layer.hasClippingMask;

  const currentSize = svgLayer.rect().size;
  const scale = Math.min(layer.width / currentSize.width, layer.height / currentSize.height);

  if (scale !== 1) {
    // scaling instead of resizing (changing width and height directly) recalculates border radius
    svgLayer.multiplyBy(scale);
  }

  svgLayer.rect = {
    origin: {
      x: layer.x,
      y: layer.y
    },
    size: {
      width: layer.width,
      height: layer.height
    }
  };

  return svgLayer;
}

export default function fixSVGLayer(layer) {
  const svgLayer = makeNativeSVGLayer(layer);

  if (svgLayer === null) {
    return;
  }

  const newLayerString = toSJSON(svgLayer);
  const newLayerObject = JSON.parse(newLayerString);

  replaceProperties(layer, newLayerObject);
}
