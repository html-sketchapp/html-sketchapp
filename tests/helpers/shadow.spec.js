import {splitShadowString, shadowStringToObject} from '../../html2asketch/helpers/shadow';

test('splitShadowString: should return array of splitted shadowStrings', () => {
  const boxShadow = 'rgb(0, 0, 0) 0px 0px 5px 2px, red 0px 0px 5px 2px inset, ' +
  '#0F0 0 0px 5px 2px, rgba(0, 0, 0, 0) 3.5px 1px 0 0';

  expect(splitShadowString(boxShadow)).toEqual([
    'rgb(0, 0, 0) 0px 0px 5px 2px',
    'red 0px 0px 5px 2px inset',
    '#0F0 0 0px 5px 2px',
    'rgba(0, 0, 0, 0) 3.5px 1px 0 0'
  ]);
});

test('splitShadowString: should handle single shadow', () => {
  const boxShadow = 'rgb(0, 0, 0) 0px 0px 5px 2px';

  expect(splitShadowString(boxShadow)).toEqual([
    'rgb(0, 0, 0) 0px 0px 5px 2px'
  ]);
});

test('splitShadowString: should return empty array for no shadows', () => {
  const boxShadow = '';

  expect(splitShadowString(boxShadow)).toEqual([]);
});

test('splitShadowString: should handle multiple', () => {
  const boxShadow = 'rgb(0, 0, 0) 0px 0px 5px 2px';

  expect(splitShadowString(boxShadow)).toEqual([
    'rgb(0, 0, 0) 0px 0px 5px 2px'
  ]);
});

test('shadowStringToObject: should return object of parsed shadowString', () => {
  const shadowString1 = 'rgb(0, 0, 0) 0px 0px 5px 2px';
  const shadowString2 = 'rgba(0, 0, 0, 0) 0px 0px 5.5px 2.2px inset';

  expect(shadowStringToObject(shadowString1)).toEqual({
    color: 'rgb(0, 0, 0)',
    offsetX: 0,
    offsetY: 0,
    blur: 5,
    spread: 2,
    inset: false
  });
  expect(shadowStringToObject(shadowString2)).toEqual({
    color: 'rgba(0, 0, 0, 0)',
    offsetX: 0,
    offsetY: 0,
    blur: 5.5,
    spread: 2.2,
    inset: true
  });
});
