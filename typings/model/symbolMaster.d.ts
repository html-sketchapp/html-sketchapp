import Base from "./base";
import SymbolInstance from "./symbolInstance";

export interface SymbolMasterProps {
  x: number;
  y: number;
}

export interface GetSymbolInstanceProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class SymbolMaster extends Base {
  constructor(props: SymbolMasterProps);
  public getSymbolInstance(props: GetSymbolInstanceProps): SymbolInstance;
}
