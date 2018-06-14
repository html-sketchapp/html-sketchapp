import {splitShadowString, shadowStringToObject} from '../../html2asketch/helpers/shadow';

test('splitShadowString: should return array of splitted shadowStrings', () => {
  const boxShadow = 'rgb(0, 0, 0) 0px 0px 5px 2px, rgb(255, 0, 0) 0px 0px 5px 2px inset';

  expect(splitShadowString(boxShadow)).toEqual([
    'rgb(0, 0, 0) 0px 0px 5px 2px',
    'rgb(255, 0, 0) 0px 0px 5px 2px inset'
  ]);
});

test('shadowStringToObject: should return object of parsed shadowString', () => {
  const shadowString = 'rgb(0, 0, 0) 0px 0px 5px 2px';

  expect(shadowStringToObject(shadowString)).toEqual({
    color: 'rgb(0, 0, 0)',
    offsetX: 0,
    offsetY: 0,
    blur: 5,
    spread: 2
  });
});
