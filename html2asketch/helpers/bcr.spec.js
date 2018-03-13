import {getGroupBCR} from './bcr';

test('returns default BCR if no nodes are provided', () => {
  expect(getGroupBCR([])).toEqual({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
});

test('for a single node returns BCR of that node', () => {
  const node1 = {
    getBoundingClientRect: () => ({
      x: 10,
      y: 10,
      width: 100,
      height: 100
    })
  };

  expect(getGroupBCR([node1])).toEqual({
    x: 10,
    y: 10,
    width: 100,
    height: 100
  });
});

test('correctly calculates BCR of multiple nodes', () => {
  const node1 = {
    getBoundingClientRect: () => ({
      x: 10,
      y: 10,
      width: 100,
      height: 100
    })
  };

  const node2 = {
    getBoundingClientRect: () => ({
      x: 5,
      y: 50,
      width: 150,
      height: 50
    })
  };

  const node3 = {
    getBoundingClientRect: () => ({
      x: 5,
      y: 500,
      width: 150,
      height: 500
    })
  };

  expect(getGroupBCR([node1, node2, node3])).toEqual({
    x: 5,
    y: 10,
    width: 150,
    height: 990
  });
});
