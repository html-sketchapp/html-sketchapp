import {generateID, makeColorFromCSS} from './utils';
import {TextAlignment} from 'sketch-constants';
import {toSJSON} from 'sketchapp-json-plugin';
import findFont from './findFont';

const TEXT_ALIGN = {
  auto: TextAlignment.Left,
  left: TextAlignment.Left,
  right: TextAlignment.Right,
  center: TextAlignment.Center,
  justify: TextAlignment.Justified
};

const TEXT_DECORATION_UNDERLINE = {
  none: 0,
  underline: 1,
  double: 9
};

const TEXT_DECORATION_LINETHROUGH = {
  none: 0,
  'line-through': 1
};

// this doesn't exist in constants
const TEXT_TRANSFORM = {
  uppercase: 1,
  lowercase: 2,
  initial: 0,
  inherit: 0,
  none: 0,
  capitalize: 0
};

function makeParagraphStyle(textStyle) {
  const pStyle = NSMutableParagraphStyle.alloc().init();

  if (textStyle.lineHeight !== undefined) {
    pStyle.minimumLineHeight = textStyle.lineHeight;
    pStyle.maximumLineHeight = textStyle.lineHeight;
  }

  if (textStyle.textAlign) {
    pStyle.alignment = TEXT_ALIGN[textStyle.textAlign];
  }

  return pStyle;
}

function encodeSketchJSON(sketchObj) {
  const encoded = toSJSON(sketchObj);

  return JSON.parse(encoded);
}

// This shouldn't need to call into Sketch, but it does currently, which is bad for perf :(
function makeAttributedString(string, textStyle) {
  const font = findFont(textStyle);

  const color = makeColorFromCSS(textStyle.color || 'black');

  const attribs = {
    MSAttributedStringFontAttribute: font.fontDescriptor(),
    NSParagraphStyle: makeParagraphStyle(textStyle),
    NSColor: NSColor.colorWithDeviceRed_green_blue_alpha(
      color.red,
      color.green,
      color.blue,
      color.alpha
    ),
    NSUnderline: TEXT_DECORATION_UNDERLINE[textStyle.textDecoration] || 0,
    NSStrikethrough: TEXT_DECORATION_LINETHROUGH[textStyle.textDecoration] || 0
  };

  if (textStyle.letterSpacing !== undefined) {
    attribs.NSKern = textStyle.letterSpacing;
  }

  if (textStyle.textTransform !== undefined) {
    attribs.MSAttributedStringTextTransformAttribute =
      TEXT_TRANSFORM[textStyle.textTransform] * 1;
  }

  const attribStr = NSAttributedString.attributedStringWithString_attributes_(
    string,
    attribs
  );
  const msAttribStr = MSAttributedString.alloc().initWithAttributedString(
    attribStr
  );

  return encodeSketchJSON(msAttribStr);
}

function makeTextStyle(textStyle) {
  const pStyle = makeParagraphStyle(textStyle);

  const font = findFont(textStyle);

  const color = makeColorFromCSS(textStyle.color || 'black');

  const value = {
    _class: 'textStyle',
    encodedAttributes: {
      MSAttributedStringFontAttribute: encodeSketchJSON(font.fontDescriptor()),
      NSColor: encodeSketchJSON(
        NSColor.colorWithDeviceRed_green_blue_alpha(
          color.red,
          color.green,
          color.blue,
          color.alpha
        )
      ),
      NSParagraphStyle: encodeSketchJSON(pStyle),
      NSKern: textStyle.letterSpacing || 0,
      MSAttributedStringTextTransformAttribute:
      TEXT_TRANSFORM[textStyle.textTransform || 'initial'] * 1
    }
  };

  return {
    _class: 'style',
    sharedObjectID: generateID(),
    miterLimit: 10,
    startDecorationType: 0,
    endDecorationType: 0,
    textStyle: value
  };
}

export function fixTextLayer(layer) {
  layer.attributedString = makeAttributedString(layer.text, layer.style);
  delete layer.style;
  delete layer.text;
}

export function fixSharedTextStyle(sharedStyle) {
  sharedStyle.value = makeTextStyle(sharedStyle.style);
  delete sharedStyle.style;
}
