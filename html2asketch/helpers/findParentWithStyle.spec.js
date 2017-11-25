import findParentWithStyle from './findParentWithStyle';

test('finds parent node with style', () => {
  const parent = document.createElement('div');

  parent.setAttribute('style', 'opacity:0.5;');

  const child = document.createElement('span');

  parent.appendChild(child);

  expect(findParentWithStyle(child, 'opacity', '0.5')).toBeDefined();
});

test('returns undefined', () => {
  const parent = document.createElement('div');

  parent.setAttribute('style', 'color:blue;');

  const child = document.createElement('span');

  parent.appendChild(child);

  expect(findParentWithStyle(child, 'overflow', 'hidden')).not.toBeDefined();
});
