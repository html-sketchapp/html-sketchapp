// based on https://github.com/airbnb/react-sketchapp/blob/master/src/jsonUtils/hacksForJSONImpl.js

import fixSVGLayer from './fixSVG';
import {replaceProperties} from './utils';

const IMG_SVG = 'svg';
const IMG_BLOB = 'blob';
const IMG_UNSUPPORTED = 'unsupported';
const IMG_ERROR = 'error';

function getImageDataFromUrl(url) {
  const fetchedData = NSData.dataWithContentsOfURL(NSURL.URLWithString(url));

  if (!fetchedData) {
    return {
      type: IMG_ERROR,
      data: null,
    };
  }

  const firstByte = fetchedData
    .subdataWithRange(NSMakeRange(0, 1))
    .debugDescription();

  // Check for first byte. Must use non-type-exact matching (!=).
  // 0xFF = JPEG, 0x89 = PNG, 0x47 = GIF, 0x49 = TIFF, 0x4D = TIFF
  if (
    /* eslint-disable eqeqeq */
    firstByte == '<3c>'
    /* eslint-enable eqeqeq */
  ) {
    const rawSVGString = NSString.alloc().initWithData_encoding_(fetchedData, NSUTF8StringEncoding);

    return {
      type: IMG_SVG,
      data: rawSVGString,
    };
  } else if (
    /* eslint-disable eqeqeq */
    firstByte != '<ff>' &&
    firstByte != '<89>' &&
    firstByte != '<47>' &&
    firstByte != '<49>' &&
    firstByte != '<4d>'
    /* eslint-enable eqeqeq */
  ) {
    return {
      type: IMG_UNSUPPORTED,
      data: null,
    };
  } else {
    return {
      type: IMG_BLOB,
      data: fetchedData,
    };
  }
}

/**
 * @returns {NSImage} big red rectangle - our error image
 */
function getErrorImage() {
  // eslint-disable-next-line max-len
  const errorUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8w8DwHwAEOQHNmnaaOAAAAABJRU5ErkJggg==';

  return NSImage.alloc().initWithContentsOfURL(NSURL.URLWithString(errorUrl));
}

export function fixImageFill(layer, fill) {
  if (!fill.image || !fill.image.url) {
    return null;
  }

  const {type: imageType, data: imageData} = getImageDataFromUrl(fill.image.url);

  if (imageType === IMG_SVG) {
    const svgLayer = {
      x: layer.frame.x,
      y: layer.frame.y,
      width: layer.frame.width,
      height: layer.frame.height,
      rawSVGString: imageData,
    };

    fixSVGLayer(svgLayer);

    // we are replacing the parent layer with SVGLayer
    replaceProperties(layer, svgLayer);
  } else {

    let nsImage, msImage;

    if (imageType === IMG_ERROR || imageType === IMG_UNSUPPORTED) {
      nsImage = getErrorImage();
    } else {
      nsImage = NSImage.alloc().initWithData(imageData);
    }

    if (MSImageData.alloc().initWithImage_convertColorSpace !== undefined) {
      msImage = MSImageData.alloc().initWithImage_convertColorSpace(nsImage, false);
    } else {
      msImage = MSImageData.alloc().initWithImage(nsImage);
    }

    const data = msImage.data().base64EncodedStringWithOptions(NSDataBase64EncodingEndLineWithCarriageReturn);
    const sha1 = msImage.sha1().base64EncodedStringWithOptions(NSDataBase64EncodingEndLineWithCarriageReturn);

    fill.image.data = {_data: data};
    fill.image.sha1 = {_data: sha1};

    delete fill.image.url;
  }

  return imageType;
}

export default function fixImageFillsInLayer(layer) {
  if (!layer.style || !layer.style.fills) {
    return;
  }

  const fills = layer.style.fills;

  for (const fill of fills) {
    const imageType = fixImageFill(layer, fill);

    if (imageType === IMG_SVG) {
      // since we can't replace the parent twice, we have to bail out
      return;
    }
  }
}
