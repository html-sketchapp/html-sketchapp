import SymbolInstance from '../../html2asketch/model/symbolInstance';

test('sets symbolID', () => {
  const symbolID = 'pizza';
  const symbolInstance = new SymbolInstance({x: 0, y: 0, width: 100, height: 100, symbolID});

  expect(symbolInstance.toJSON().symbolID).toEqual(symbolID);
});

test('sets symbolID', () => {
  const symbolID = 'pizza';
  const symbolInstance = new SymbolInstance({x: 0, y: 0, width: 100, height: 100, symbolID: 'initial-id'});

  symbolInstance.setId(symbolID);

  expect(symbolInstance.toJSON().symbolID).toEqual(symbolID);
});

test('sets frame dimensions', () => {
  const symbolInstance = new SymbolInstance({x: 0, y: 50, width: 100, height: 150, symbolID: 'pizza'});

  const frame = symbolInstance.toJSON().frame;

  expect(frame.x).toBe(0);
  expect(frame.y).toBe(50);
  expect(frame.width).toBe(100);
  expect(frame.height).toBe(150);
});
