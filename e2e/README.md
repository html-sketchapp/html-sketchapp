# E2E test for html-sketchapp

`npm run e2e` runs `nodeToSketchLayers` and `nodeTreeToSketchPage` methods on all test pages from the `/tests` folder (using Puppeteer) and compares resulting JSON with the expected output from the `/expected` folder.

⚠️ Note that `.asketch.json` files from the `/expected` folder are not valid `.asketch.json` files (importing them via plugin will fail). Random values are replaced with hardcoded strings (e.g. objectIDs), and some values are rounded to reduce test flakiness. If you want to generate valid files, please see "I want to debug tests" section below.

## My change breaks tests

If you made a legit change that breaks e2e tests, please run `npm run e2e-fix` which will override files from `/expected` folder with new values.

If your change unexpectedly breaks tests, see "I want to debug tests" section below.

## I want to add new test cases

Please create a new HTML file in `/tests` or add your test cases to the existing HTML files (whichever makes more sense). After that, you can generate new `/expected` files with `npm run e2e-fix`.

## I want to debug tests

You can use `npm run e2e-debug` to generate valid `.asketch.json` files (see `/valid` folder) that can be imported to Sketch via plugin. You can also add `console.log`s to the HTML pages being tested - they should show up when running `npm run e2e`. If you are stuck ask for help in the PR!
