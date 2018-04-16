export interface TextStyleProps {
  color: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: string;
  textDecoration: string;
  textAlign: string;
}

export default class TextStyle {
  constructor(props: TextStyleProps);
  public toJSON(): string;
}
