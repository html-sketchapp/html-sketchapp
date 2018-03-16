import {isVisible} from './visibility';
import {JSDOM} from 'jsdom';

test('correctly identifies visible nodes', () => {
  const dom = new JSDOM(`
  <html>
  <head>
    <style>
    </style>
  </head>
  <body>
    <p class='check-me'>text</p>
    <div>
      <p class='check-me'></p>
    </div>
  </body>
  </html>
  `, {
    runScripts: 'outside-only'
  });

  // fix for offsetParent support in jsdom
  Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetParent', {
    get() {
      return this.parentNode;
    }
  });

  dom.window.eval(`
  ${isVisible.toString()}

  window.result = Array.from(document.querySelectorAll('.check-me')).every(isVisible);
  `);

  expect(dom.window.result).toEqual(true);
});

test('correctly identifies not visible nodes', () => {
  const dom = new JSDOM(`
  <html>
  <head>
  <style>
    .one {
      display: none;
    }
    .two {
      width: 0;
      height: 0;
      overflow: hidden
    }
    .three {opacity: 0}
    .four {visibility: hidden}
  </style>
  </head>
  <body>
    <p class='one check-me'>text</p>

  </body>
  </html>
  `, {
    runScripts: 'outside-only'
  });

  /*
      <div class='two check-me'>text</div>
    <div class='three check-me'>text</div>
    <div class='four check-me'>text</div>*/

  // fix for offsetParent support in jsdom
  Object.defineProperty(dom.window.HTMLElement.prototype, 'offsetParent', {
    get() {
      return this.parentNode;
    }
  });

  dom.window.eval(`
  ${isVisible.toString()}

  window.result = !Array.from(document.querySelectorAll('.check-me')).some(isVisible);
  `);

  expect(dom.window.result).toEqual(true);
});
