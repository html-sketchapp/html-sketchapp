import {toSJSON} from 'sketchapp-json-plugin';
import {replaceProperties} from './utils';

function makeNativeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  svgImporter.prepareToImportFromData(svgData);
  const svgLayer = svgImporter.importAsLayer();

  svgLayer.frame().setX(layer.x);
  svgLayer.frame().setY(layer.y);
  svgLayer.frame().setWidth(layer.width);
  svgLayer.frame().setHeight(layer.height);
  svgLayer.resizingConstraint = layer.resizingConstraint;

  return svgLayer;
}

export default function fixSVGLayer(layer) {
  const svgLayer = makeNativeSVGLayer(layer);
  const newLayerString = toSJSON(svgLayer);
  const newLayerObject = JSON.parse(newLayerString);

  replaceProperties(layer, newLayerObject);
}
