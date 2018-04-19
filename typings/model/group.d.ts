import Base from "./base";

export interface GroupProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class Group extends Base {
  constructor(props: GroupProps);
}
