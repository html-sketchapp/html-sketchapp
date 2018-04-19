import {isNodeVisible, isTextVisible} from '../../html2asketch/helpers/visibility';
import {JSDOM} from 'jsdom';

test('isNodeVisible: correctly identifies visible nodes', () => {
  const dom = new JSDOM(`
  <html>
  <head>
    <style>
    </style>
  </head>
  <body>
    <p class='check-me'>text</p>
    <div style='position: absolute'>
      <p class='check-me'></p>
    </div>
    <div class='check-me' style='width: 0'>text</div>
    <div class='check-me' style='opacity: 0.1'>text</div>
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
  ${isNodeVisible.toString()}

  const nodesToCheck = Array.from(document.querySelectorAll('.check-me'));
  window.invisibleNodes = nodesToCheck.filter(n => !isNodeVisible(n));
  `);

  expect(dom.window.invisibleNodes).toEqual([]);
});

test('isNodeVisible: correctly identifies not visible nodes', () => {
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
      /* jsdom doesn't translate overflow:hidden to overflowX:hidden and overflowY:hidden */
      overflowX: hidden;
      overflowY: hidden;
    }
    .three {opacity: 0}
    .four {visibility: hidden}
    .five {
      clip: rect(0px, 0px, 0px, 0px);
      position: absolute;
    }
    .six {visibility: collapse}
  </style>
  </head>
  <body>
    <p class='one check-me'>text</p>
    <div class='two check-me'>text</div>
    <div class='three check-me'>text</div>
    <div class='four check-me'><div class='check-me'></div></div>
    <div class='five check-me'></div>
    <div class='six check-me'></div>
    <div class='remove-me check-me'></div>
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
  ${isNodeVisible.toString()}

  const nodesToCheck = Array.from(document.querySelectorAll('.check-me'));

  // detach node .remove-me
  document.body.removeChild(document.querySelector('.remove-me'));

  window.visibleNodes = nodesToCheck.filter(n => isNodeVisible(n));
  `);

  expect(dom.window.visibleNodes).toEqual([]);
});

test('isTextVisible: correctly identifies not visible text', () => {
  const dom = new JSDOM(`
  <html>
  <head>
  <style>
    .one {
      overflowX: hidden;
      overflowY: hidden;
      text-indent: -99999px;
    }
  </style>
  </head>
  <body>
    <p class='one check-me'>text</p>
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
  ${isTextVisible.toString()}

  const nodesToCheck = Array.from(document.querySelectorAll('.check-me'));

  window.visibleText = nodesToCheck.filter(n => isTextVisible(getComputedStyle(n)));
  `);

  expect(dom.window.visibleText).toEqual([]);
});
