// Keep this pure for easy testing in the future.
export default function convertAngleToFromAndTo(angle) {
  function convertAngleInDegreesToFromAndTo(degrees) {
    // we begin "from" (0,0) and have a circle (returned as "to") with starting from point at (1,0) for 0deg (to right)
    // default 0deg
    const from = {x: 0, y: 0};
    const to = {x: 1, y: 0};

    if (degrees === 0) {
      return {from, to};
    }

    // sin() and cos() needs radians to work with
    const angleInRadians = degrees * (Math.PI / 180);

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
      to: {x: x,y: y}
    };
  }
  
  // we need angle to be a float number
  const degrees = Number.parseFloat(angle);

  // but if we don't have a number we also support some strings
  if (Number.isNaN(degrees)) {
    switch (angle) {
      case 'to right':
        return convertAngleInDegreesToFromAndTo(0);
      case 'to bottom':
        return convertAngleInDegreesToFromAndTo(90);
      case 'to left':
        return convertAngleInDegreesToFromAndTo(180);
      case 'to top':
        return convertAngleInDegreesToFromAndTo(270);
      default:
        throw TypeError('Incorrect angle.');
    }
  }
  
  return convertAngleInDegreesToFromAndTo(degrees);
}
