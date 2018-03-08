import Base from './base';

class Base2 extends Base {
  constructor() {
    super();
    this._class = 'base2';
  }
}

test('generates deterministic id', () => {
  const a = new Base2();
  const b = new Base2();

  a.setName('Badge');
  b.setName('Badge');

  const actual = a.toJSON().do_objectID;
  const expected = b.toJSON().do_objectID;

  expect(actual).toBe(expected);
});

test('inherit layer will carry incrementedParentID', () => {
  const parent = new Base2();
  const child = new Base2();

  parent.setID('Badge/default-0');
  parent.addLayer(child);

  const actual = parent.toJSON().layers[0].do_objectID;
  const expected = 'Badge/default-0-0';

  expect(actual).toBe(expected);
});

test('inherit layers will carry incrementedParentID', () => {
  const parent = new Base2();
  const child1 = new Base2();
  const child2 = new Base2();

  parent.setID('Badge/default-0');
  parent.addLayer(child1);
  parent.addLayer(child2);

  const actual = [
    parent.toJSON().layers[0].do_objectID,
    parent.toJSON().layers[1].do_objectID
  ].toString();

  const expected = [
    'Badge/default-0-0',
    'Badge/default-0-1'
  ].toString();

  expect(actual).toBe(expected);
});

test('deeply inherited layers will carry incrementedParentID all along', () => {
  const parent = new Base2();
  const child1 = new Base2();
  const child2 = new Base2();
  const grandChild1 = new Base2();
  const grandChild2 = new Base2();

  parent.setID('Badge/default-0');
  parent.addLayer(child1);
  parent.addLayer(child2);
  child2.addLayer(grandChild1);
  child2.addLayer(grandChild2);

  const actual = [
    parent.toJSON().layers[0].do_objectID,
    parent.toJSON().layers[1].do_objectID,
    parent.toJSON().layers[1].layers[0].do_objectID,
    parent.toJSON().layers[1].layers[1].do_objectID
  ].toString();

  const expected = [
    'Badge/default-0-0',
    'Badge/default-0-1',
    'Badge/default-0-1-0',
    'Badge/default-0-1-1'
  ].toString();

  expect(actual).toBe(expected);
});

test('can only be used when extended', () => {
  const a = new Base();
  const b = new Base2();

  expect(() => {
    a.toJSON();
  }).toThrow();

  expect(() => {
    b.toJSON();
  }).not.toThrow();
});

test('setName', () => {
  const a = new Base2();
  const name = 'test/name-should-work';

  a.setName(name);

  expect(a.toJSON().name).toBe(name);
});

test('addLayer', () => {
  const a = new Base2();
  const layer1 = {name: 'layer1'};
  const layer2 = {name: 'layer2'};

  a.addLayer({
    toJSON: () => layer1
  });
  a.addLayer({
    toJSON: () => layer2
  });

  expect(a.toJSON().layers).toEqual([layer1, layer2]);
});

test('setStyle', () => {
  const a = new Base2();
  const style = {color: 'pink'};

  a.setStyle({
    toJSON: () => style
  });

  expect(a.toJSON().style).toBe(style);
});
