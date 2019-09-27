import SymbolMaster, {SYMBOL_SMART_LAYOUT} from '../../html2asketch/model/symbolMaster';

test('toJSON() generates deterministic symbolIDs', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const symbolID = symbolMaster.toJSON().symbolID;

  expect(symbolMaster.toJSON().symbolID).toEqual(symbolID);
});

test('symbolID can be set', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});
  const id = 'test-id';

  symbolMaster.setId(id);

  expect(symbolMaster.toJSON().symbolID).toEqual(id);
});

test('symbol has a default groupLayout', () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});

  expect(symbolMaster.toJSON().groupLayout).not.toBeNull();
});

test('symbol groupLayout can be changed' , () => {
  const symbolMaster = new SymbolMaster({x: 200, y: 300});

  const groupLayoutBefore = symbolMaster.toJSON().groupLayout;

  symbolMaster.setGroupLayout(SYMBOL_SMART_LAYOUT.LEFT_TO_RIGHT);

  const groupLayoutAfter = symbolMaster.toJSON().groupLayout;

  expect(groupLayoutBefore).not.toEqual(groupLayoutAfter);
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
