const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const jsdiff = require('variable-diff');

const injectedScriptPath = './dist/inject.bundle.js';
const shadowDOMScriptPath = './test-el.js';
const testPageURL = 'file://' + path.resolve('./test-page.html');

const tests = ['layers', 'page'];

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

  await page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.addScriptTag({
    path: shadowDOMScriptPath
  });

  await page.addScriptTag({
    path: injectedScriptPath
  });

  let anyError = false;

  await Promise.all(tests.map(async test => {
    try {
      const expectedPath = `./expected-${test}.asketch.json`;
      const actualJSON = await page.evaluate(`body2sketch.${test}JSON(document.body)`);

      removeRandomness(actualJSON);

      // update file with expected output by uncommenting the two lines below
      // fs.writeFileSync(path.resolve(__dirname, expectedPath), JSON.stringify(actualJSON, null, 2));
      // if ('dummy test to make linter happy'.length) {
      //   return;
      // }

      const expectedJSONBuffer = fs.readFileSync(path.resolve(__dirname, expectedPath));
      const expectedJSON = JSON.parse(expectedJSONBuffer.toString());

      const diff = jsdiff(expectedJSON, actualJSON);

      if (diff.changed) {
        console.error(`E2E test "${test}": ❌ Oh no! That's not the expected output. See the diff below:`);
        console.log(diff.text);
        anyError = true;
      }
    } catch (error) {
      console.error(`E2E test "${test}": ❌ Oh no! There was an error running the test:`);
      console.error(error);
      anyError = true;
    }
  }));

  browser.close();

  if (anyError) {
    process.exit(1);
  } else {
    console.log('E2E tests: ✅');
  }
});
