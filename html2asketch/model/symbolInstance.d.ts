import Base from './base';

export interface SymbolInstanceProps {
  x: number;
  y: number;
  width: number;
  height: number;
  symbolID: string;
}

export default class SymbolInstance extends Base {
  constructor(props: SymbolInstanceProps);
}
