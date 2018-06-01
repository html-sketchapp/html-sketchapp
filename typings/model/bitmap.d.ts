import Base from "./base";

export interface BitmapProps {
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Bitmap extends Base {
  constructor(props: BitmapProps);
}
