function _getCurrentView(doc) {
  if (doc.currentView) {
    return doc.currentView();
  } else if (doc.contentDrawView) {
    return doc.contentDrawView();
  }
  console.log('zoomToFit: can not get the currentView');
  return null;
}

export default function zoomToFit(context) {
  const doc = context.document;
  const page = doc.currentPage();
  const layers = page.layers();
  const view = _getCurrentView(doc);

  const rect = layers.reduce((result, layer) => {
    const frame = layer.frame();
    const minX = frame.x();
    const minY = frame.y();
    const maxX = frame.x() + frame.width();
    const maxY = frame.y() + frame.height();

    if (result === null) {
      return {
        minX,
        minY,
        maxX,
        maxY
      };
    }

    if (minX < result.minX) {
      result.minX = minX;
    }
    if (minY < result.minY) {
      result.minY = minY;
    }
    if (maxX > result.maxX) {
      result.maxX = maxX;
    }
    if (maxY > result.maxY) {
      result.maxY = maxY;
    }

    return result;
  }, null);

  const x = rect.minX;
  const y = rect.minY;
  const width = rect.maxX - rect.minX;
  const height = rect.maxY - rect.minY;

  view.zoomToFitRect(NSMakeRect(x, y, width, height));

}
