import Page from "./page";

export default class Base {
  public addLayer(layer: Base): void;
  public getID(): string;
  public setFixedWidthAndHeight(): void;
  public setResizingConstraint(...constraints: string[]): void;
  public setName(name: string): void;
  public setStyle(style: any): void;
  public toJSON(): string;
}
