import TextStyle from "./textStyle";

export default class Document {
  public setName(name: string): void;
  public addPage(page: string): void;
  public addTextStyle(textLayer: TextStyle): void;
  public addColor(color: string): void;
  public toJSON(): string;
}
