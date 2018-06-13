# E2E test for html-sketchapp

`npm run e2e` runs `nodeToSketchLayers` and `nodeTreeToSketchPage` methods on all test pages from the `/tests` folder (using Puppeteer) and compares resulting JSON with the expected output from the `/expected` folder.

⚠️ Note that `.asketch.json` files from the `/expected` folder are not valid `.asketch.json` file. Random values are replaced with hardcoded strings (e.g. objectIDs), and some values are rounded to reduce test flakiness.

## My change broke tests

If you made a legit change that breaks these test please update files in the `/expected` folder (see `run.js` for details).

## I want to add a test

Please create a HTML file in `/tests` or add a new test case to existing HTML file (whichever makes more sense). After that, you can generate new `/expected/**/*.asketch.json` files.
