const sketch = require('sketch/dom');

const alignArtboards = document => {
  document.pages().forEach(nativePage => {
    const page = sketch.fromNative(nativePage);

    page.layers.forEach((layer, i) => {
      const x = page.layers.slice(0, i).reduce((a, v) => a + v.frame.width + 100, 0);

      layer.frame = {
        ...layer.frame,
        y: 0,
        x
      };
    });
  });
};

const cleanupFile = context => {
  const document = context.document;

  alignArtboards(document);
};

export default cleanupFile;
