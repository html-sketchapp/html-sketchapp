import {getSVGString} from '../../html2asketch/helpers/svg';
import {JSDOM} from 'jsdom';

// unsuported by jsdom
global.SVGDefsElement = () => {/*do nothing*/};
global.SVGTitleElement = () => {/*do nothing*/};
global.SVGUseElement = () => {/*do nothing*/};
global.SVGSymbolElement = () => {/*do nothing*/};

test('returns correct outer HTML of the DOM node w/o children', () => {
  const outerHTML = 'pizza';
  const node1 = {
    children: [],
    outerHTML
  };

  expect(getSVGString(node1)).toEqual(outerHTML);
});

test('returns correct outher HTML of the DOM node with children', () => {
  const dom = new JSDOM(`
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100"/>
  <rect x="10" y="10" width="30" height="30"/>
  <g>
    <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5"/>
  </g>
</svg>`);

  const document = dom.window.document;
  const node = document.querySelector('svg');

  global.document = document;
  global.SVGElement = dom.window.SVGElement;

  //jsdom closes all tags with </bla> :(
  expect(getSVGString(node)).toEqual(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100"></circle>
  <rect x="10" y="10" width="30" height="30"></rect>
  <g>
    <ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5"></ellipse>
  </g>
</svg>`);
});

test('inlines styles of the children, ignores styles with default values', () => {
  const dom = new JSDOM(`
<html>
<head>
<style>
  #a {
    fill: red;
    overflow: visible; /* default value */
    opacity: 1; /* default value */
  }

  #b {
    fill: blue;
    width: 40px;
    height: 40px;
  }
</style>
</head>
<body>
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" id="a"></circle>
  <g>
    <rect x="10" y="10" width="30" height="30" id="b"></rect>
  </g>
</svg>`);

  const document = dom.window.document;
  const node = document.querySelector('svg');

  global.document = document;
  global.SVGElement = dom.window.SVGElement;
  global.getComputedStyle = dom.window.getComputedStyle;

  expect(getSVGString(node)).toEqual(`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="100" id="a" style="fill: red;"></circle>
  <g>
    <rect x="10" y="10" width="30" height="30" id="b" style="height: 40px; width: 40px; fill: blue;"></rect>
  </g>
</svg>`);
});
