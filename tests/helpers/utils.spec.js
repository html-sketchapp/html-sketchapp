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
