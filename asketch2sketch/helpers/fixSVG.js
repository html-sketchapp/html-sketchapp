import {toSJSON} from 'sketchapp-json-plugin';
import {replaceProperties} from './utils';

function makeNativeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  svgImporter.prepareToImportFromData(svgData);
  const svgLayer = svgImporter.importAsLayer();

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
  svgLayer.resizingConstraint = layer.resizingConstraint;

  return svgLayer;
}

export default function fixSVGLayer(layer) {
  const svgLayer = makeNativeSVGLayer(layer);
  const newLayerString = toSJSON(svgLayer);
  const newLayerObject = JSON.parse(newLayerString);

  replaceProperties(layer, newLayerObject);
}
