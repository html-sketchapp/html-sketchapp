import {fixImageFill} from './fixImageFill';

export default function fixBitmapLayer(layer) {
  fixImageFill(layer, layer);
}
