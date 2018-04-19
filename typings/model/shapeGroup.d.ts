import Base from "./base";

export interface ShapeGroupProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class ShapeGroup extends Base {
  constructor(props: ShapeGroupProps);
}
