import Page from './page';

let width, height;
const options = {width, height};

test('deterministic ID', () => {
  const page = new Page({...options, id: 'ui kit'});

  const actual = page.toJSON().do_objectID;
  const expected = 'ui kit';

  expect(actual).toBe(expected);
});
