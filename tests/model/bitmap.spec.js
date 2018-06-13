import Bitmap from '../../html2asketch/model/bitmap';

test('image url', () => {
  const bitmap = new Bitmap({url: 'foo.png', x: 0, y: 0, width: 100, height: 100});

  expect(bitmap.toJSON().image.url).toEqual('foo.png');
});
