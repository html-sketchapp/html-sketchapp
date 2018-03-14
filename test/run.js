const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const jsdiff = require('variable-diff');

const injectedScriptPath = './build/inject.bundle.js';
const expectedPath = './expected.asketch.json';
const testPagePath = './test-page.html';

function removeRandomness(layer) {
  if (layer._objectID) {
    layer._objectID = 'pizza';
  }

  if (layer.image && layer.image._ref) {
    layer.image._ref = 'images/haribo';
  }

  if (layer._style && layer._style._fills) {
    layer._style._fills.forEach(removeRandomness);
  }

  if (layer._layers) {
    layer._layers.forEach(removeRandomness);
  }
}

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();

  await page.setViewport({width: 800, height: 600});
  await page.goto('file://' + path.resolve(testPagePath), {
    waitUntil: 'networkidle0'
  });

  await page.addScriptTag({
    path: injectedScriptPath
  });

  const asketchJSON = await page.evaluate('body2sketch.default(document.body)');

  asketchJSON.forEach(removeRandomness);

  // update file with expected output by uncommenting the two lines below
  // fs.writeFileSync(path.resolve(__dirname, expectedPath), JSON.stringify(asketchJSON, null, 2));
  // process.exit();

  const expectedJSONBuffer = fs.readFileSync(path.resolve(__dirname, expectedPath));
  const expectedAsketchJSON = JSON.parse(expectedJSONBuffer.toString());

  const diff = jsdiff(expectedAsketchJSON, asketchJSON);

  browser.close();

  if (diff.changed) {
    console.log('Oh no! That\'s not the expected output.');
    console.log(diff.text);
    process.exit(1);
  }
});
