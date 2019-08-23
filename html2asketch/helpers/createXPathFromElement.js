//https://stackoverflow.com/a/5178132
export default function createXPathFromElement(elm) {
  const allNodes = document.getElementsByTagName('*');
  let segs;

  for (segs = []; elm && elm.nodeType === 1; elm = elm.parentNode) {
    if (elm.hasAttribute('id')) {
      let uniqueIdCount = 0;

      for (let n = 0; n < allNodes.length; n++) {
        if (allNodes[n].hasAttribute('id') && allNodes[n].id === elm.id) {
          uniqueIdCount++;
        }
        if (uniqueIdCount > 1) {
          break;
        }
      }
      if (uniqueIdCount === 1) {
        segs.unshift(`id("${elm.getAttribute('id')}")`);
        return segs.join('/');
      } else {
        segs.unshift(`${elm.localName.toLowerCase()}[@id="${elm.getAttribute('id')}"]`);
      }
    } else if (elm.hasAttribute('class')) {
      segs.unshift(`${elm.localName.toLowerCase()}[@class="${elm.getAttribute('class')}"]`);
    } else {
      let i = 1;

      for (let sib = elm.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.localName === elm.localName) {
          i++;
        }
      }
      segs.unshift(`${elm.localName.toLowerCase()}[${i}]`);
    }
  }
  return segs.length ? `/${segs.join('/')}` : null;
}
