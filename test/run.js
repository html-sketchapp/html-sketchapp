const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const jsdiff = require('variable-diff');

const injectedScriptPath = './build/inject.bundle.js';
const expectedPath = './expected.asketch.json';
const testPageURL = 'file://' + path.resolve('./test-page.html');

function removeRandomness(layer) {
  if (layer.do_objectID) {
    layer.do_objectID = 'pizza';
  }

  if (layer.image) {
    if (layer.image._ref) {
      layer.image._ref = 'images/haribo';
    }

    if (layer.image.url) {
      layer.image.url = path.basename(layer.image.url);
    }
  }

  // for some reason only width differs between local and travis
  if (layer.frame && layer.frame.width) {
    layer.frame.width = Math.floor(layer.frame.width);
  }

  // we need to go deeper

  if (layer.style && layer.style.fills) {
    layer.style.fills.forEach(removeRandomness);
  }

  if (layer.layers) {
    layer.layers.forEach(removeRandomness);
  }
}

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const args = isTravis ? ['--no-sandbox', '--disable-setuid-sandbox'] : [];

puppeteer.launch({args}).then(async browser => {
  const page = await browser.newPage();

  await page.setViewport({width: 800, height: 600});
  await page.goto(testPageURL, {
    waitUntil: 'networkidle0'
  });

  await page.addScriptTag({
    path: injectedScriptPath
  });

  const asketchJSON = await page.evaluate('body2sketch.default(document.body)');

  removeRandomness(asketchJSON);

  // update file with expected output by uncommenting the two lines below
  // fs.writeFileSync(path.resolve(__dirname, expectedPath), JSON.stringify(asketchJSON, null, 2));
  // process.exit();

  const expectedJSONBuffer = fs.readFileSync(path.resolve(__dirname, expectedPath));
  const expectedAsketchJSON = JSON.parse(expectedJSONBuffer.toString());

  const diff = jsdiff(expectedAsketchJSON, asketchJSON);

  browser.close();

  if (diff.changed) {
    console.error('E2E tests: ❌ Oh no! That\'s not the expected output. See the diff below:');
    console.log(diff.text);
    process.exit(1);
  } else {
    console.log('E2E tests: ✅');
  }
});
