export const makeImageDataFromUrl = url => {
  let fetchedData = NSData.dataWithContentsOfURL(NSURL.URLWithString(url));

  if (fetchedData) {
    const firstByte = fetchedData
      .subdataWithRange(NSMakeRange(0, 1))
      .description();

    // Check for first byte. Must use non-type-exact matching (!=).
    // 0xFF = JPEG, 0x89 = PNG, 0x47 = GIF, 0x49 = TIFF, 0x4D = TIFF
    if (
      /* eslint-disable eqeqeq */
      firstByte != '<ff>' &&
    firstByte != '<89>' &&
    firstByte != '<47>' &&
    firstByte != '<49>' &&
    firstByte != '<4D>'
    /* eslint-enable eqeqeq */
    ) {
      fetchedData = null;
    }
  }

  let image;

  if (!fetchedData) {
    const errorUrl = 'data:image/png;base64,' +
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==';

    image = NSImage.alloc().initWithContentsOfURL(
      NSURL.URLWithString(errorUrl)
    );
  } else {
    image = NSImage.alloc().initWithData(fetchedData);
  }

  return MSImageData.alloc().initWithImage_convertColorSpace(image, false);
};

export default function fixImageFill(layer) {
  if (!layer.style || !layer.style.fills) {
    return;
  }

  layer.style.fills.forEach(fill => {
    if (!fill.image || !fill.image.url) {
      return;
    }

    const img = makeImageDataFromUrl(fill.image.url);

    const data = img.data().base64EncodedStringWithOptions(NSDataBase64EncodingEndLineWithCarriageReturn);
    const sha1 = img.sha1().base64EncodedStringWithOptions(NSDataBase64EncodingEndLineWithCarriageReturn);

    fill.image.data = {_data: data};
    fill.image.sha1 = {_data: sha1};

    delete fill.image.url;
  });
}
