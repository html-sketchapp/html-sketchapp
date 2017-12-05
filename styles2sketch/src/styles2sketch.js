import React from 'react';
import {View, Text, Image, render, makeSymbol} from 'react-sketchapp';

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

function renderText(layer) {
  // in sketch, text will be made larger if transformed to uppercase,
  // but bounding box will not be made larger to accommodate
  if (layer.style.textTransform === 'uppercase') {
    delete layer.style.textTransform;
    layer.text = layer.text.toUpperCase();
  }

  return (
    <Text
      key={uniqueId()}
      style={{
        ...layer.style,

        position: 'absolute',
        left: layer.x,
        top: layer.y
      }}
    >
      {layer.text}
    </Text>
  );
}

function renderView({
  name,
  height,
  width,
  style: {display, boxShadow, borderRadius, backgroundColor, border = {}},
  x,
  y
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
        height,
        width
      }}
    />
  );
}

function renderLayers(layers) {
  return layers.map(layer => {
    const {frame: {x, y}} = layer;

    const texts = [];
    const images = [];
    const views = [];

    layer.layers.forEach((childLayer, index) => {
      const {href} = childLayer.style;

      const {_class} = childLayer;

      if (href) {
        images.unshift(renderImage(childLayer));
      }

      if (_class === 'text') {
        texts.unshift(renderText(childLayer, index));
        return null;
      }

      views.unshift(renderView(childLayer));
    });

    const Component = () =>
      <View
        key={uniqueId()}
        style={{
          position: 'absolute',
          left: x,
          top: y
        }}
      >
        {texts}
        {images}
        {views}
      </View>;
      
      makeSymbol(Component, layer.name);

    return Component();
  });
}

export default function Plugin(context) {
  const json = requestJson();

  render(
    <View style={json.dimensions}>{renderLayers(json.layers)}</View>,
    context.document.currentPage()
  );
}
