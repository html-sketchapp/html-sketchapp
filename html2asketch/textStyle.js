// INPUT: "Helvetica Neue", Helvetica, Arial, sans-serif
// OUTPUT: Helvetica Neue
function getFirstFont(fonts) {
  let font = fonts.split(',')[0].trim();

  font = font.replace(/^["']+|["']+$/g, '');

  return font;
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
    textAlign
  }) {
    this._color = color;
    this._fontSize = fontSize;
    this._fontFamily = getFirstFont(fontFamily);
    this._lineHeight = lineHeight;
    this._letterSpacing = letterSpacing;
    this._fontWeight = fontWeight;
    this._textTransform = textTransform;
    this._textDecoration = textDecoration;
    this._textAlign = textAlign;
  }

  toJSON() {
    const json = {
      'color': this._color,
      'fontSize': this._fontSize,
      'fontFamily': this._fontFamily,
      'fontWeight': this._fontWeight,
      'textTransform': this._textTransform,
      'textDecoration': this._textDecoration,
      'textAlign': this._textAlign
    };

    if (this._lineHeight !== undefined) {
      json['lineHeight'] = this._lineHeight;
    }

    if (this._letterSpacing !== undefined) {
      json['letterSpacing'] = this._letterSpacing;
    }

    return json;
  }
}

export default TextStyle;
