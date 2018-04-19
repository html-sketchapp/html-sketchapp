import Base from './base';

export interface RectangleCornerProps {
  topLeft: number;
  bottomLeft: number;
  topRight: number;
  bottomRight: number;
}

export interface RectangleProps {
  width: number;
  height: number;
  cornerRadius?: RectangleCornerProps;
}

export default class Rectangle extends Base {
  constructor(props: RectangleProps);
}
