const sketch = require('sketch/dom');

const manageSymbols = context => {
  const document = context.document;

  document.pages().forEach(nativePage => {
    const nativeSymbolsPage = sketch.Page.createSymbolsPage();

    nativeSymbolsPage.parent = document;

    const symbolsPage = sketch.fromNative(nativeSymbolsPage);
    const page = sketch.fromNative(nativePage);

    nativeSymbolsPage.name = `${nativeSymbolsPage.name} ${page.name}`;

    const unusableTrash = [];

    page.layers.forEach(layer => {
      const {type, frame} = layer;

      if (frame.height <= 0 || frame.width <= 0) {
        unusableTrash.push(layer.id);
      }

      if (type === 'SymbolMaster') {
        symbolsPage.layers = [...symbolsPage.layers, layer];
      }
    });

    page.layers = [...page.layers.filter(layer => unusableTrash.indexOf(layer.id) < 0)];
  });

};

export default manageSymbols;
