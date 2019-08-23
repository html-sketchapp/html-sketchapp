import Base from '../../html2asketch/model/base';
import {RESIZING_CONSTRAINTS} from '../../html2asketch/helpers/utils';

class Base2 extends Base {
  constructor() {
    super();
    this._class = 'base2';
  }
}

test('generates unique id', () => {
  const a = new Base();
  const b = new Base();

  expect(a.getID()).not.toBe(b.getID());
});

test('supports custom id', () => {
  const a = new Base({id: 'test-id'});
  const b = new Base({id: 'test-id'});

  expect(a.getID()).toBe(b.getID());
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

test('setObjectID', () => {
  const a = new Base2();
  const id = 'test/name-should-work';

  a.setObjectID(id);

  expect(a.toJSON().do_objectID).toBe(id);
});

test('addLayer', () => {
  const a = new Base2();
  const layer1 = {name: 'layer1'};
  const layer2 = {name: 'layer2'};

  a.addLayer({
    toJSON: () => layer1,
  });
  a.addLayer({
    toJSON: () => layer2,
  });

  expect(a.toJSON().layers).toEqual([layer1, layer2]);
});

test('setStyle', () => {
  const a = new Base2();
  const style = {color: 'pink'};

  a.setStyle({
    toJSON: () => style,
  });

  expect(a.toJSON().style).toBe(style);
});

test('setResizingConstraint', () => {
  const a = new Base2();
  const {TOP, LEFT} = RESIZING_CONSTRAINTS;
  const resizingConstraint = [TOP, LEFT];

  a.setResizingConstraint(...resizingConstraint);

  expect(a.toJSON().resizingConstraint).toBe(TOP & LEFT);
});

test('setIsLocked', () => {
  const a = new Base2();

  a.setIsLocked(true);

  expect(a.toJSON().isLocked).toBe(true);
});

test('setFixedWidthAndHeight', () => {
  const a = new Base2();
  const {WIDTH, HEIGHT} = RESIZING_CONSTRAINTS;

  a.setFixedWidthAndHeight();

  expect(a.toJSON().resizingConstraint).toBe(WIDTH & HEIGHT);
});
