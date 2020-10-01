// Keep this pure for easy testing in the future.
export default function convertAngleToFromAndTo(angle) {
  function parseAngleToRadians(angle) {
    const match = angle.match(/^(-?(?:\d+)?(?:\.\d+)?)(deg|grad|rad|turn)$/);

    if (!match) {
      return Number.NaN;
    }

    const value = parseFloat(match[1]) + 0;
    const unit = match[2];

    switch (unit) {
      case 'deg':
        return value * (Math.PI / 180);
      case 'grad':
        return value * (Math.PI / 200);
      case 'rad':
        return value;
      case 'turn':
        return value * 2 * Math.PI;
      default:
        return Number.NaN;
    }
  }

  function convertRadiansToFromAndTo(radians) {
    // we begin "from" (0,0) and have a circle (returned as "to")
    // with starting from point at (0,-1) for 0deg (to bottom)
    // default 0deg
    const from = {x: 0, y: 0};
    const to = {x: 0, y: -1};

    if (radians === 0) {
      return {from, to};
    }

    // sin() and cos() needs radians to work with
    // and we need to rotate the whole thing by 90deg so we support "to bottom" as default
    const angleInRadians = radians + parseAngleToRadians('-270deg');

    // calculate circle's (x,y) wich is sin nad cos of given radians
    // we support precision to make things human readable
    const precision = 2;
    let x = Number.parseFloat(Math.cos(angleInRadians).toFixed(precision));
    let y = Number.parseFloat(Math.sin(angleInRadians).toFixed(precision));

    // convert -0 to +0, sin() and cos() may return -0 wich can lead to some miss-calcualtions
    x += 0;
    y += 0;

    return {
      from,
      to: {x, y},
    };
  }

  // we need angle to be a float number
  const radians = parseAngleToRadians(angle);

  // but if we don't have a number we also support some strings
  if (Number.isNaN(radians)) {
    switch (angle.toLowerCase()) {
      case 'to bottom':
        return convertRadiansToFromAndTo(parseAngleToRadians('0deg'));
      case 'to right bottom':
        return convertRadiansToFromAndTo(parseAngleToRadians('45deg'));
      case 'to right':
        return convertRadiansToFromAndTo(parseAngleToRadians('90deg'));
      case 'to right top':
        return convertRadiansToFromAndTo(parseAngleToRadians('135deg'));
      case 'to top':
        return convertRadiansToFromAndTo(parseAngleToRadians('180deg'));
      case 'to left top':
        return convertRadiansToFromAndTo(parseAngleToRadians('225deg'));
      case 'to left':
        return convertRadiansToFromAndTo(parseAngleToRadians('270deg'));
      case 'to left bottom':
        return convertRadiansToFromAndTo(parseAngleToRadians('315deg'));
      default:
        throw TypeError('Incorrect angle.');
    }
  }

  return convertRadiansToFromAndTo(radians);
}
