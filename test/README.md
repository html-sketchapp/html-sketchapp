# E2E test for html-sketchapp

This test runs html2asketch on `test-page.html` (via Puppeteer) and compares resulting `.asketch.json` file with the `expected.asketch.json`.

If you made a legit change that breaks this test please update `expected.asketch.json` (see `run.js` for details).
