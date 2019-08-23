import {getGroupBCR} from '../../html2asketch/helpers/bcr';

test('returns default BCR if no nodes are provided', () => {
  expect(getGroupBCR([])).toEqual({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  });
});

test('for a single node returns BCR of that node', () => {
  const node1 = {
    getBoundingClientRect: () => ({
      left: 10,
      top: 10,
      right: 110,
      bottom: 110,
      width: 100,
      height: 100,
    }),
  };

  expect(getGroupBCR([node1])).toEqual({
    left: 10,
    top: 10,
    right: 110,
    bottom: 110,
    width: 100,
    height: 100,
  });
});

test('correctly calculates BCR of multiple nodes', () => {
  const node1 = {
    getBoundingClientRect: () => ({
      left: 10,
      top: 10,
      right: 110,
      bottom: 110,
      width: 100,
      height: 100,
    }),
  };

  const node2 = {
    getBoundingClientRect: () => ({
      left: 5,
      top: 50,
      right: 155,
      bottom: 100,
      width: 150,
      height: 50,
    }),
  };

  const node3 = {
    getBoundingClientRect: () => ({
      left: 5,
      top: 500,
      right: 155,
      bottom: 1000,
      width: 150,
      height: 500,
    }),
  };

  expect(getGroupBCR([node1, node2, node3])).toEqual({
    left: 5,
    top: 10,
    right: 155,
    bottom: 1000,
    width: 150,
    height: 990,
  });
});
