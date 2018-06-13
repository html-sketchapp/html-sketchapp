const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const jsdiff = require('variable-diff');
const removeRandomness = require('./src/removeRandomness');

const TESTS_FOLDER = './tests';
const injectedScriptPath = './dist/inject.bundle.js';

const isTravis = 'TRAVIS' in process.env && 'CI' in process.env;
const args = isTravis ? ['--no-sandbox', '--disable-setuid-sandbox'] : [];

const testedMehtods = ['nodeToSketchLayers', 'nodeTreeToSketchPage'];

let testBrowser = null;
let testPage = null;

function getPuppeteerPage() {
  if (testPage !== null) {
    return testPage;
  }

  return puppeteer.launch({args}).then(async browser => {
    const page = await browser.newPage();

    await page.setViewport({width: 800, height: 600});
    await page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    testBrowser = browser;
    testPage = page;

    return page;
  });
}

async function runTest(file) {
  const testPageURL = 'file://' + path.resolve(TESTS_FOLDER, file);

  console.log(`🔍 Testing ${file}`);

  const page = await getPuppeteerPage();

  await page.goto(testPageURL, {
    waitUntil: 'networkidle0'
  });

  await page.addScriptTag({
    path: injectedScriptPath
  });

  let anyError = false;

  await Promise.all(testedMehtods.map(async method => {
    try {
      const expectedPath = `./expected/${method}/${file}.asketch.json`;
      const actualJSON = await page.evaluate(`body2sketch.${method}Test(document.body)`);

      removeRandomness(actualJSON);

      // update file with expected output by uncommenting the two lines below
      // fs.writeFileSync(path.resolve(__dirname, expectedPath), JSON.stringify(actualJSON, null, 2));
      // return;

      const expectedJSONBuffer = fs.readFileSync(path.resolve(__dirname, expectedPath));
      const expectedJSON = JSON.parse(expectedJSONBuffer.toString());

      const diff = jsdiff(expectedJSON, actualJSON);

      if (diff.changed) {
        console.error(`❌ E2E test "${file}"/"${method}" failed.`);
        console.error('Oh no! That\'s not the expected output. See the diff below:');
        console.log(diff.text);
        anyError = true;
      }
    } catch (error) {
      console.error(`❌ E2E test "${file}"/"${method}" failed.`);
      console.error('Oh no! There was an error running the test:');
      console.error(error);
      anyError = true;
    }
  }));

  if (anyError) {
    throw new Error();
  }
}

const testResults = fs.readdirSync(TESTS_FOLDER)
  .filter(file => file.endsWith('.html'))
  .reduce((promise, file) => promise.then(() => runTest(file)), Promise.resolve());

testResults.then(() => {
  if (testBrowser) {
    testBrowser.close();
  }

  console.log('E2E tests: ✅');
}).catch(() => {
  if (testBrowser) {
    testBrowser.close();
  }

  console.log('E2E tests: ❌');
  process.exit(1);
});
