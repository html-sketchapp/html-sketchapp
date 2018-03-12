import React from 'react';
import {Artboard, View, Text, Image, render} from 'react-sketchapp';
import test from './test';

let idCount = 0;
const uniqueId = () => idCount++;

function requestJson() {
  const panel = NSOpenPanel.openPanel();

  panel.setCanChooseFiles(true);
  panel.setTitle('Select a json file');
  panel.setPrompt('Select');
  panel.setAllowedFileTypes(['json']);

  if (panel.runModal() !== NSModalResponseOK || panel.URLs().length === 0) {
    return;
  }

  const urls = panel.URLs();
  const url = urls[0];

  const data = NSData.dataWithContentsOfURL(url);
  const content = NSString.alloc().initWithData_encoding_(
    data,
    NSUTF8StringEncoding
  );

  try {
    return JSON.parse(content);
  } catch (e) {
    const alert = NSAlert.alloc().init();

    alert.setMessageText('File is not a valid JSON.');
    alert.runModal();
  }
}

function renderImage({
  style,
  source,
  children
}) {
  return (
    <Image key={uniqueId()} style={style} source={{uri: source}}>
      {children.map(renderLayer)}
    </Image>
  );
}

function renderText({
  style,
  children
}) {
  return (
    <Text key={uniqueId()} style={style}>
      {children.map(renderLayer)}
    </Text>
  );
}

function renderView({
  style,
  children
}) {
  return (
    <View key={uniqueId()} style={style}>
      {children.map(renderLayer)}
    </View>
  );
}

function renderLayer(layer) {
  if (typeof layer === 'string') {
    return layer;
  }

  const {type} = layer;

  if (type === 'text') {
    return renderText(layer);
  } else if (type === 'image') {
    return renderImage(layer);
  } else if (type === 'view') {
    return renderView(layer);
  }

  return null;
}

function removeExistingLayers(context) {
  if (context.containsLayers()) {
    const loop = context.children().objectEnumerator();
    let currLayer = loop.nextObject();

    while (currLayer) {
      if (currLayer !== context) {
        currLayer.removeFromParent();
      }
      currLayer = loop.nextObject();
    }
  }
}

export default function Plugin(context) {
  const json = test;// HACK load test page while testing - requestJson();
  const document = context.document;
  const page = document.currentPage();

  removeExistingLayers(page);

  const newPage = json.pages[0];

  const result = newPage.items.map(layer => renderLayer(layer));

  render(
    <Artboard style={{
      width: 800,
      height: 800
    }}>{result}</Artboard>,
    page
  );
}
