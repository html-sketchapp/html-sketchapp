import {replaceProperties} from './utils';

test('replaceProperties: overrides object propeties with properties from another object', () => {
  const dest = {a: 'a', b: 'b', c: {}, d: () => {/*empty*/}};
  const src = {c: 'c', d: 'd', e: {}, f: () => {/*empty*/}};

  replaceProperties(dest, src);

  expect(dest).not.toBe(src);
  expect(dest).toEqual(src);
});
