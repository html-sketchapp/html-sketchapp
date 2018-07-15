import SymbolMaster from '../../html2asketch/model/symbolMaster';

test('toJSON() generates deterministic symbolIDs', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const symbolID = symbolMaster.toJSON().symbolID;

  expect(symbolMaster.toJSON().symbolID).toEqual(symbolID);
});

test('symbol instances have the same symbolID', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const symbolInstance = symbolMaster.getSymbolInstance({x: 0, y: 0});

  expect(symbolMaster.toJSON().symbolID).toEqual(symbolInstance.toJSON().symbolID);
});

test('symbol instances inherit size from master symbol by default', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300, width: 150, height: 75});
  const symbolInstance = symbolMaster.getSymbolInstance({x: 12, y: 34});

  const masterObject = symbolMaster.toJSON();
  const instanceObject = symbolInstance.toJSON();

  expect(instanceObject.frame.width).toEqual(masterObject.frame.width);
  expect(instanceObject.frame.height).toEqual(masterObject.frame.height);
  expect(instanceObject.frame.x).toEqual(12);
  expect(instanceObject.frame.y).toEqual(34);
});

test('symbol instances inherit size from master symbol by default', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300, width: 150, height: 75});
  const symbolInstance = symbolMaster.getSymbolInstance({x: 1, y: 2, width: 15, height: 7.5});

  const instanceObject = symbolInstance.toJSON();

  expect(instanceObject.frame.width).toEqual(15);
  expect(instanceObject.frame.height).toEqual(7.5);
  expect(instanceObject.frame.x).toEqual(1);
  expect(instanceObject.frame.y).toEqual(2);
});
