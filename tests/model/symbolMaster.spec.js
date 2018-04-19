import SymbolMaster from '../../html2asketch/model/symbolMaster';

test('toJSON() generates deterministic symbolIDs', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const symbolID = symbolMaster.toJSON().symbolID;

  expect(symbolMaster.toJSON().symbolID).toEqual(symbolID);
});

test('symbol instances have the same symbolID', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const symbolInstance = symbolMaster.getSymbolInstance({x: 0, y: 0, width: 100, height: 100});

  expect(symbolMaster.toJSON().symbolID).toEqual(symbolInstance.toJSON().symbolID);
});
