const splitShadowString = boxShadow => {
  const shadowStrings = boxShadow.split(/x, |t, /).map(
    (str, i, array) => {
      if (i + 1 < array.length) {
        if (str.match(/inse$/)) {
          return str + 't';
        } else if (str.match(/p$/)) {
          return str + 'x';
        }
      }
      return str;
    }
  );

  return shadowStrings;
};

const shadowStringToObject = shadowString => {
  const matches = shadowString.match(
    /^([a-z0-9#., ()]+) ([-]?[0-9.]+)px ([-]?[0-9.]+)px ([-]?[0-9.]+)px ([-]?[0-9.]+)px ?(inset)?$/i
  );

  if (matches && matches.length === 7) {
    return {
      color: matches[1],
      offsetX: parseInt(matches[2], 10),
      offsetY: parseInt(matches[3], 10),
      blur: parseInt(matches[4], 10),
      spread: parseInt(matches[5], 10)
    };
  }
};

export {
  splitShadowString,
  shadowStringToObject
};
