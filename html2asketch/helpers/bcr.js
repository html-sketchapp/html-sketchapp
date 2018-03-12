// TODO: should probably also take into account children of each node
export function getGroupBCR(nodes) {
  const groupBCR = nodes.reduce((result, node) => {
    const {x, y, width, height} = node.getBoundingClientRect();

    if (width === 0 && height === 0) {
      return result;
    }

    if (!result) {
      return {
        startX: x,
        startY: y,
        endX: x + width,
        endY: y + height
      };
    }

    if (x < result.startX) {
      result.startX = x;
    }

    if (y < result.startY) {
      result.startY = y;
    }

    if (x + width > result.endX) {
      result.endX = x + width;
    }

    if (y + height > result.endY) {
      result.endY = y + height;
    }

    return result;
  }, null);

  if (groupBCR === null) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }

  return {
    x: groupBCR.startX,
    y: groupBCR.startY,
    width: groupBCR.endX - groupBCR.startX,
    height: groupBCR.endY - groupBCR.startY
  };
}
