import Base from "./base";
import SymbolInstance from "./symbolInstance";

export interface SymbolMasterProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface GetSymbolInstanceProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class SymbolMaster extends Base {
  constructor(props: SymbolMasterProps);
  public setId(id: string);
  public addLayer(layer: Base);
  public getSymbolInstance(props: GetSymbolInstanceProps): SymbolInstance;
}
