export default function makeSVGLayer(layer) {
  const svgString = NSString.stringWithString(layer.rawSVGString);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();

  svgImporter.prepareToImportFromData(svgData);
  const svgLayer = svgImporter.importAsLayer();

  // imported svg may have different size, and proportions, than expected by the `layer`
  // we have to do resizing and centering ourselves to avoid stretching of the image
  const expectedWidth = layer.width;
  const expectedHeight = layer.height;
  const actualWidth = svgLayer.frame().width();
  const actualHeight = svgLayer.frame().height();

  if (actualWidth === 0 || actualHeight === 0) {
    svgLayer.frame().setX(layer.x);
    svgLayer.frame().setY(layer.y);
    svgLayer.frame().setWidth(layer.width);
    svgLayer.frame().setHeight(layer.height);

    return svgLayer;
  }

  let resultWidth = expectedWidth;
  let resultHeight = (expectedWidth / actualWidth) * actualHeight;

  if (actualHeight > actualWidth) {
    resultHeight = expectedHeight;
    resultWidth = (expectedHeight / actualHeight) * actualWidth;
  }

  const fixX = (expectedWidth - resultWidth) / 2;
  const fixY = (expectedHeight - resultHeight) / 2;

  svgLayer.frame().setX(layer.x + fixX);
  svgLayer.frame().setY(layer.y + fixY);
  svgLayer.frame().setWidth(resultWidth);
  svgLayer.frame().setHeight(resultHeight);

  return svgLayer;
}
