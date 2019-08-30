const sketch = require('sketch/dom');

const organizeSymbolMasters = (document, lastIndex) => {
  document.pages().forEach((nativePage, i) => {
    if (i < lastIndex) {
      return;
    }
    const nativeSymbolsPage = sketch.Page.createSymbolsPage();

    nativeSymbolsPage.parent = document;

    const symbolsPage = sketch.fromNative(nativeSymbolsPage);
    const page = sketch.fromNative(nativePage);

    nativeSymbolsPage.name = `${nativeSymbolsPage.name} ${page.name}`;

    const unusableTrash = [];

    page.layers.forEach(layer => {
      const {type, frame, layers} = layer;

      if (frame.height <= 0 || frame.width <= 0 || layers.length <= 0) {
        unusableTrash.push(layer.id);
        return;
      }

      if (type === 'SymbolMaster') {
        symbolsPage.layers = [...symbolsPage.layers, layer];
        return;
      }
    });

    page.layers = [...page.layers.filter(layer => unusableTrash.indexOf(layer.id) < 0 && layer.type !== 'SymbolMaster')];
  });
};

const manageSymbols = context => {
  const document = context.document;

  organizeSymbolMasters(document);
};

export default manageSymbols;
