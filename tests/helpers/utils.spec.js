import {calculateResizingConstraintValues, resizingConstraintValues} from '../../html2asketch/helpers/utils';

test('reduce series of numbers to their bitwise AND value', () => {
  const { top, left, height } = resizingConstraintValues;
  const input = [left, height]
  const output = top & left & height;

  expect(calculateResizingConstraintValues(top, ...input)).toEqual(output);
});

test('given undefined values will return 0', () => {
  const { top, wat, none } = resizingConstraintValues;
  const output = 0;

  expect(calculateResizingConstraintValues(top, wat)).toEqual(output);
});

describe('when given invalid combinations', () => {
  test('will throw when top, bottom & height are specified', () => {
    const { top, bottom, height } = resizingConstraintValues;
    const input = [bottom, height]

    expect(() => calculateResizingConstraintValues(top, ...input)).toThrow();
  });

  test('will throw when left, right & width are specified', () => {
    const { left, right, width } = resizingConstraintValues;
    const input = [right, width]

    expect(() => calculateResizingConstraintValues(left, ...input)).toThrow();
  });
});
