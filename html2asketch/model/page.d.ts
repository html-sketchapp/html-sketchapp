import Base from './base';

export interface PageProps {
  width: number;
  height: number;
}

export default class Page extends Base {
  public _width: number;
  public _height: number;

  constructor(props: PageProps);
}
