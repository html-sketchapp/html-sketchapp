import Group from '../../html2asketch/model/group';

test('toJSON', () => {
  const group = new Group({x: 0, y: 50, width: 200, height: 100});

  const json = group.toJSON();

  expect(json._class).toBe('group');
  expect(json.frame.width).toEqual(200);
  expect(json.frame.height).toEqual(100);
  expect(json.frame.x).toEqual(0);
  expect(json.frame.y).toEqual(50);
});
