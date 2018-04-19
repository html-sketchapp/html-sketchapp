import Base from "./base";

export interface SVGProps {
  x: number;
  y: number;
  width: number;
  height: number;
  rawSVGString: string;
}

export default class SVG extends Base {
  constructor(props: SVGProps);
}
