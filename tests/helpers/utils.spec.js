import {calculateResizingConstraintValue, RESIZING_CONSTRAINTS} from '../../html2asketch/helpers/utils';

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
