export function fixWhiteSpace(text, whiteSpace) {
  switch (whiteSpace) {
    case 'normal':
    case 'nowrap':
      return text.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    case 'pre-line':
      return text
        .replace(/(^[^\S\n]+)|([^\S\n]+$)/g, '')// trim but leave \n
        .replace(/[^\S\n]+/g, ' ')// collapse whitespace (except \n)
        .replace(/[^\S\n]?\n[^\S\n]?/g, '\n');//remove whitespace before & after \n
    default:
      // pre, pre-wrap
  }

  return text;
}
