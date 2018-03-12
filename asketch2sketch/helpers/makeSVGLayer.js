export default function makeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  svgImporter.prepareToImportFromData(svgData);
  const svgLayer = svgImporter.importAsLayer();

  svgLayer.frame().setX(layer.x);
  svgLayer.frame().setY(layer.y);
  svgLayer.frame().setHeight(layer.height);
  svgLayer.frame().setWidth(layer.width);

  return svgLayer;
}
