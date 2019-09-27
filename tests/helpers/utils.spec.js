import {
  calculateResizingConstraintValue,
  RESIZING_CONSTRAINTS,
  getGroupLayout,
  DEFAULT_GROUP_LAYOUT,
  SMART_LAYOUT,
} from '../../html2asketch/helpers/utils';

test('reduce series of numbers to their bitwise AND value', () => {
  const {TOP, LEFT, HEIGHT} = RESIZING_CONSTRAINTS;
  const input = [LEFT, HEIGHT];
  const output = TOP & LEFT & HEIGHT;

  expect(calculateResizingConstraintValue(TOP, ...input)).toEqual(output);
});

test('given undefined values will throw', () => {
  const {TOP, wat} = RESIZING_CONSTRAINTS;

  expect(() => calculateResizingConstraintValue(TOP, wat)).toThrow();
});

describe('when given invalid combinations', () => {
  test('will throw when top, bottom & height are specified', () => {
    const {TOP, BOTTOM, HEIGHT} = RESIZING_CONSTRAINTS;

    expect(() => calculateResizingConstraintValue(TOP, BOTTOM, HEIGHT)).toThrow();
  });

  test('will throw when left, right & width are specified', () => {
    const {LEFT, RIGHT, WIDTH} = RESIZING_CONSTRAINTS;

    expect(() => calculateResizingConstraintValue(LEFT, RIGHT, WIDTH)).toThrow();
  });
});

describe('getGroupLayout()', () => {
  test('returns default group when no params passed', () => {
    expect(getGroupLayout()).toEqual(DEFAULT_GROUP_LAYOUT);
  });

  test('returns chosen layout group', () => {
    expect(getGroupLayout(SMART_LAYOUT.HORIZONTALLY_CENTER)).not.toEqual(DEFAULT_GROUP_LAYOUT);
  });
});
