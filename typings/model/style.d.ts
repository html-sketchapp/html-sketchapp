export interface GradiantFillProps {
  angle: string;
  stops: string[];
}

export interface BorderProps {
  color: string;
  thickness: number;
}

export interface ShadowProps {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
  spread?: number;
}

export default class Style {
  public addColorFill(color: string, opacity: number): void;
  public addGradientFill(props: GradiantFillProps): void;
  public addImageFill(image: string): void;
  public addBorder(props: BorderProps): void;
  public addShadow(props: ShadowProps): void;
  public addInnerShadow(props: ShadowProps): void;
  public addOpacity(opacity: number): void;
  public toJSON(): string;
}
