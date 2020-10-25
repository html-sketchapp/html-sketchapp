// Keep this pure for easy testing in the future.
export default function convertAngleToFromAndTo(angle, width, height) {
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

  function fixFloat(float) {
    const precistion = 7;

    // round with precision and convert -0 to +0
    return Number.parseFloat(float.toFixed(precistion)) + 0;
  }

  function calculateFromAndTo({angleInRadians, width, height}) {
    const angle180degInRadians = parseAngleToRadians('180deg');

    // calculate gradient height
    const gradientHeight = Math.abs(width * Math.sin(angleInRadians)) + Math.abs(height * Math.cos(angleInRadians));

    // calculate to which is half of gradient times cos/sin of angle
    const toX = fixFloat((gradientHeight / 2) * Math.sin(angleInRadians));
    const toY = fixFloat((gradientHeight / 2) * Math.cos(angleInRadians));

    // calculate from which is half of gradient times cos/sin of angle + 180deg
    const fromX = fixFloat((gradientHeight / 2) * Math.sin(angleInRadians + angle180degInRadians));
    const fromY = fixFloat((gradientHeight / 2) * Math.cos(angleInRadians + angle180degInRadians));

    return {from: {x: fromX, y: fromY}, to: {x: toX, y: toY}};
  }

  function normalizeDimensionsForSketch({from, to, width, height}) {
    const response = {from: {...from}, to: {...to}};

    // y axis should be proportional to height
    response.from.y /= height;
    response.to.y /= height;

    // x axis should be proportional to width
    response.from.x /= width;
    response.to.x /= width;

    // y axis is reflected downwards in sketch
    response.from.y *= -1;
    response.to.y *= -1;

    // let's fixFloat
    response.from.x = fixFloat(response.from.x);
    response.from.y = fixFloat(response.from.y);
    response.to.x = fixFloat(response.to.x);
    response.to.y = fixFloat(response.to.y);

    // (0.5, 0.5) is the shift of the gradient line in sketch,
    // as we want gradient line to always go through the
    // center of the shape in both axis, so we need to move whole axis
    response.from.x += 0.5;
    response.from.y += 0.5;
    response.to.x += 0.5;
    response.to.y += 0.5;

    return response;
  }

  const normalizedAngle = angle.trim().toLowerCase();

  // we need angle to be a float number
  let angleInRadians = parseAngleToRadians(normalizedAngle);

  // but if we don't have a number we also support some strings
  if (Number.isNaN(angleInRadians)) {
    switch (normalizedAngle) {
      case 'to top':
        angleInRadians = parseAngleToRadians('0deg');
        break;
      case 'to right top':
      case 'to top right':
        angleInRadians = parseAngleToRadians('45deg');
        break;
      case 'to right':
        angleInRadians = parseAngleToRadians('90deg');
        break;
      case 'to right bottom':
      case 'to bottom right':
        angleInRadians = parseAngleToRadians('135deg');
        break;
      case 'to bottom':
        angleInRadians = parseAngleToRadians('180deg');
        break;
      case 'to left bottom':
      case 'to bottom left':
        angleInRadians = parseAngleToRadians('225deg');
        break;
      case 'to left':
        angleInRadians = parseAngleToRadians('270deg');
        break;
      case 'to left top':
      case 'to top left':
        angleInRadians = parseAngleToRadians('315deg');
        break;
      default:
        throw TypeError(`Incorrect angle: ${angle}`);
    }
  }

  const {from, to} = calculateFromAndTo({angleInRadians, width, height});

  return normalizeDimensionsForSketch({from, to, width, height});
}
