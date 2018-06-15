import {toSJSON} from 'sketchapp-json-plugin';
import {replaceProperties} from './utils';

function makeNativeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  svgImporter.prepareToImportFromData(svgData);
  let svgLayer = svgImporter.importAsLayer();

  while (svgLayer && svgLayer.layers().length === 1 && svgLayer.class() instanceof MSLayerGroup) {
    svgLayer = svgLayer.layers()[0];
  }

  svgLayer.resizingConstraint = layer.resizingConstraint;

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
  const newLayerString = toSJSON(svgLayer);
  const newLayerObject = JSON.parse(newLayerString);

  replaceProperties(layer, newLayerObject);
}
