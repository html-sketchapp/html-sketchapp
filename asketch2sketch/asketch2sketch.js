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

function renderImage({style: {href}, x, y, height, width}) {
  return (
    <Image
      key={uniqueId()}
      source={{uri: href}}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        height,
        width,
        overflow: 'hidden'
      }}
    />
  );
}

function renderText({
  name,
  x,
  y,
  text,
  style: {
    fontSize,
    fontFamily,
    fontWeight,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    textAlign,
    color,
    width
  }
}) {
  const style = {
    position: 'absolute',
    left: x,
    top: y,
    fontSize,
    fontFamily,
    fontWeight,
    textTransform,
    textDecoration,
    letterSpacing,
    lineHeight,
    textAlign,
    color,
    width
  };

  // in sketch, text will be made larger if transformed to uppercase,
  // but bounding box will not be made larger to accommodate
  if (style.textTransform === 'uppercase') {
    delete style.textTransform;
    text = text.toUpperCase();
  }

  return (
    <Text
      key={uniqueId()}
      name={name}
      style={style}
    >
      {text}
    </Text>
  );
}

function renderView({
  name,
  height,
  width,
  x,
  y,
  style: {
    display,
    boxShadow,
    borderRadius,
    backgroundColor,
    border = {},
    contextSettings: {
      opacity
    }
  }
}) {
  return (
    <View
      key={uniqueId()}
      name={name}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        display,
        ...border,
        ...boxShadow,
        ...borderRadius,
        backgroundColor,
        opacity,
        height,
        width
      }}
    />
  );
}

function renderLayer(layer) {
  const result = [];
  const {_class} = layer;
  const {href} = layer.style;

  if (href) {
    result.push(renderImage(layer));
  }

  if (_class === 'text') {
    result.push(renderText(layer));
  } else {
    result.push(renderView(layer));
  }

  layer.layers.reverse()
    .map(renderLayer)
    .reduce((sum, next) => sum.concat(next), [])
    .forEach(childLayer => result.push(childLayer));

  return result;
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

  const result = json.layers.reverse().map(layer => renderLayer(layer));

  render(
    <Artboard style={{
      width: json.frame.width,
      height: json.frame.height
    }}>{result}</Artboard>,
    page
  );
}
