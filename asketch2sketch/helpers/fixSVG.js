import {toSJSON, fromSJSONDictionary} from 'sketchapp-json-plugin';

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

  return svgLayer;
}

function replaceProperties(dest, src) {
  for (const prop in dest) {
    if (dest.hasOwnProperty(prop)) {
      delete dest[prop];
    }
  }

  for (const prop in src) {
    if (src.hasOwnProperty(prop)) {
      dest[prop] = src[prop];
    }
  }
}

export default function fixSVGLayer(layer) {
  const svgLayer = makeNativeSVGLayer(layer);
  const newLayerString = toSJSON(svgLayer);
  const newLayerObject = JSON.parse(newLayerString);

  replaceProperties(layer, newLayerObject);
}
