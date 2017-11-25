export default function findParentWithStyle(child, property, value) {
  let parent = child.parentElement;

  while (parent) {
    if (getComputedStyle(parent)[property] === value) {
      return parent;
    }

    parent = parent.parentElement;
  }

  // parent with style not found
  return undefined;
}
