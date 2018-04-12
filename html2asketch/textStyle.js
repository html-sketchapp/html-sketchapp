// Some websites or component libraries use font-family lists starting with OS-specific fonts.
// If the option 'skipSystemFonts' is enabled, we skip those fonts to choose a font
// Sketch is capable of.

const SYSTEM_FONTS = [
  // Apple
  '-apple-system',
  'BlinkMacSystemFont',

  // Microsoft
  'Segoe UI',

  // Android
  'Roboto'
];

// INPUT: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif
// OUTPUT: Helvetica Neue
function getFirstFont(fonts, skipSystemFonts) {
  let regularFont = undefined;
  let systemFont = undefined;

  fonts.split(',').forEach(font => {
    font = font.trim().replace(/^["']+|["']+$/g, '');
    if (font === '') {
      return;
    }

    // See above for a note on OS-specific fonts
    if (!regularFont && (!skipSystemFonts || SYSTEM_FONTS.indexOf(font) < 0)) {
      regularFont = font;
    }
    if (!systemFont) {
      systemFont = font;
    }
  });

  if (regularFont) {
    return regularFont;
  }

  if (systemFont) {
    return systemFont;
  }

  return '-apple-system';
}

class TextStyle {
  constructor({
    color,
    fontSize,
    fontFamily,
    fontWeight,
    lineHeight,
    letterSpacing,
    textTransform,
    textDecoration,
    textAlign,
    skipSystemFonts
  }) {
    this._color = color;
    this._fontSize = fontSize;
    this._fontFamily = getFirstFont(fontFamily, skipSystemFonts);
    this._lineHeight = lineHeight;
    this._letterSpacing = letterSpacing;
    this._fontWeight = fontWeight;
    this._textTransform = textTransform;
    this._textDecoration = textDecoration;
    this._textAlign = textAlign;
  }

  toJSON() {
    return {
      'color': this._color,
      'fontSize': this._fontSize,
      'fontFamily': this._fontFamily,
      'fontWeight': this._fontWeight,
      'lineHeight': this._lineHeight,
      'letterSpacing': this._letterSpacing,
      'textTransform': this._textTransform,
      'textDecoration': this._textDecoration,
      'textAlign': this._textAlign
    };
  }
}

export default TextStyle;
