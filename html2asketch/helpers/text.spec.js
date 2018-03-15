import {fixWhiteSpace} from './text';

// Sequences of whitespace are collapsed. Newline characters in the source are handled the same as other whitespace.
test('normal & nowrap', () => {
  const input = `
      Luke,  I'm


  your      father `;
  const output = 'Luke, I\'m your father';

  expect(fixWhiteSpace(input, 'normal')).toEqual(output);
  expect(fixWhiteSpace(input, 'nowrap')).toEqual(output);
});

// Sequences of whitespace are collapsed. Lines are broken at newline characters
test('pre-line', () => {
  const input = `
       Luke,  I'm
    

  your      father `;
  const output = `
Luke, I'm


your father`;

  expect(fixWhiteSpace(input, 'pre-line')).toEqual(output);
});

