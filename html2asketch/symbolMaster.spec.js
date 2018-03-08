import SymbolMaster from './symbolMaster';
import Base from './base';

let x, y;
const options = {x, y};

class BaseTest extends Base {
  constructor() {
    super();
    this._class = 'test';
  }
}

test('should set symbol name', () => {
  const a = new SymbolMaster(options);

  a.setName('Badge/default');

  const actual = a.toJSON().name;
  const expected = 'Badge/default';

  expect(actual).toBe(expected);
});

test('symbol id should equal symbol name', () => {
  const a = new SymbolMaster(options);

  a.setName('Badge/default');

  const actual = a.toJSON().symbolID;
  const expected = 'Badge/default';

  expect(actual).toBe(expected);
});

test('symbol ID should equal symbol id', () => {
  const a = new SymbolMaster(options);

  a.setName('Badge/default');

  const actual = a.toJSON().do_objectID;
  const expected = 'Badge/default';

  expect(actual).toBe(expected);
});

test.only('inherited layers will carry objectID', () => {
  const symbol = new SymbolMaster(options);
  const child1 = new BaseTest();
  const child2 = new BaseTest();

  symbol.setName('Badge/default');
  symbol.addLayer(child1);
  symbol.addLayer(child2);

  const actual = [
    symbol.toJSON().layers[0].do_objectID,
    symbol.toJSON().layers[1].do_objectID
  ].toString();
  const expected = [
    'Badge/default-0',
    'Badge/default-1'
  ].toString();

  expect(actual).toBe(expected);
});
