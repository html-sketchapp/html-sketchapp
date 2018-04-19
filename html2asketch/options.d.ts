export default interface Options {
  addArtboard?: boolean,
  artboardName?: string,
  pageName?: string,
  getRectangleName?: (node: HTMLElement) => string,
  skipSystemFonts?: boolean
}
 