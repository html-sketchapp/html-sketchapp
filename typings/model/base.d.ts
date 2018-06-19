import Page from "./page";

export default class Base {
  public addLayer(layer: Base): void;
  public getID(): string;
  public setFixedWidthAndHeight(): void;
  public setResizingConstraint(...constraints: string[]): void;
  public setUserInfo(key: string, value: any, scope?: string): void;
  public getUserInfo(key: string, scope?: string): any;
  public setName(name: string): void;
  public setStyle(style: any): void;
  public setHasClippingMask(hasClippingMask: boolean): void;
  public toJSON(): string;
}
