import Base from "./base";

export interface ShapeGroupProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export default class ShapeGroup extends Base {
  constructor(props: ShapeGroupProps);
  public setPosition(position: Position): void;
}
