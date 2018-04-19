import Base from "./base";

export interface ArtboardProps {
  width: number;
  height: number;
}

export default class Artboard extends Base {
  public _width: number;
  public _height: number;

  constructor(props: ArtboardProps);
}
