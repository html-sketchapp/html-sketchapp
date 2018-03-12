
export default function createImage(node) {
  const src = node.attributes.src;

  if (!src) {
    return null;
  }

  const absoluteUrl = new URL(src.value, location.href);

  return {
    type: 'image',
    content: absoluteUrl
  };
}
