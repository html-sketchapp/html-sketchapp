import ShapeGroup from '../../html2asketch/model/shapeGroup';

test('setHasClippingMask', () => {
  const shapeGroup = new ShapeGroup({x: 0, y: 0, width: 100, height: 100});

  expect(shapeGroup.toJSON().hasClippingMask).toBe(false);

  shapeGroup.setHasClippingMask(true);
  expect(shapeGroup.toJSON().hasClippingMask).toBe(true);
});
