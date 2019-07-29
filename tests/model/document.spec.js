import Document from '../../html2asketch/model/document';

test('generates unique id', () => {
  const a = new Document();
  const b = new Document();

  expect(a.toJSON().do_objectID).not.toBe(b.toJSON().do_objectID);
});

test('addPage', () => {
  const doc = new Document();

  expect(doc.toJSON()).toMatchObject({
    pages: []
  });

  doc.addPage({getID: () => 'my-page-id'});
  expect(doc.toJSON()).toMatchObject({
    pages: [
      expect.objectContaining({
        _ref: 'pages/my-page-id'
      })
    ]
  });
});

test('addTextStyle', () => {
  const doc = new Document();

  expect(doc.toJSON()).toMatchObject({
    layerTextStyles: {
      _class: 'sharedTextStyleContainer',
      objects: []
    }
  });

  doc.addTextStyle({
    _name: 'my-text-style-name',
    _style: {
      toJSON: () => ({my: 'json'})
    }
  });

  expect(doc.toJSON()).toMatchObject({
    layerTextStyles: {
      _class: 'sharedTextStyleContainer',
      objects: [
        {
          _class: 'sharedStyle',
          do_objectID: expect.any(String),
          name: 'my-text-style-name',
          style: {
            my: 'json'
          }
        }
      ]
    }
  });
});
