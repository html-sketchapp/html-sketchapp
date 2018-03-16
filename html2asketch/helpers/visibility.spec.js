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
    <div style='position: absolute'>
      <p class='check-me'></p>
    </div>
    <div class='check-me' style='width: 0'>text</div>
    <div class='check-me' style='opacity: 0.0001'>text</div>
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

  const nodesToCheck = Array.from(document.querySelectorAll('.check-me'));
  window.invisibleNodes = nodesToCheck.filter(n => !isVisible(n));
  `);

  expect(dom.window.invisibleNodes).toEqual([]);
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
  </style>
  </head>
  <body>
    <p class='one check-me'>text</p>
    <div class='two check-me'>text</div>
    <div class='three check-me'>text</div>
    <div class='four check-me'><div class='check-me'></div></div>
    <div class='five check-me'></div>
    <div class='six'></div>
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

  const nodesToCheck = Array.from(document.querySelectorAll('.check-me'));

  // detach node .six
  document.body.removeChild(document.querySelector('.six'));

  window.visibleNodes = nodesToCheck.filter(n => isVisible(n));
  `);

  expect(dom.window.visibleNodes).toEqual([]);
});
