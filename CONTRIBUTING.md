# Welcome, and thank you for contributing! 💗

To make sure everything goes smoothly, please refer to the checklist below.
If anything is unclear or you run into some issues, please feel free to ask questions, we will be happy to help.

## Reporting issues

- [ ] Make sure that similar issue hasn't been reported before
- If you are reporting a bug:
  - [ ] let us know what Sketch version you are using
  - [ ] make a screenshot of how output looks in the browser
  - [ ] make a screenshot of how output looks in Sketch
  - [ ] provide a minimal example (either jsbin or website where it can be tested)

## Sending Pull Requests

### Description

- If your PR is related to existing issue (or issues), make sure to link them in the description
- If your PR is not related to the existing issue, please explain what your PR introdcues
- If you believe that your PR introduces breaking changes please mention that
- Consider leaving additional comments that explain how your code works - it makes reviews much easier 🚀

### API

If you are changing public API (anything listed in `/html2asketch/index.js`) please update:

- [ ] file reexporting public API - `/html2asketch/index.js` (if you are adding or removing public class or function)
- [ ] typescript definitions - `/typings` (if you are extending, adding or removing public class or function)

### Adding new tests

Help make this project more stable 💪

- [ ] Unit tests
   - If you are changing helpers (`/html2asketch/helpers`) or models (`/html2asketch/models`) please consider adding unit tests (`/tests`)
- [ ] End to End tests
   - If you are adding or improving support for HTML/CSS feature please consider adding e2e tests (you'll find instructions in the `/e2e` folder)

### Testing your changes

- [ ] If your PR changes the `html2asketch` output (`.asketch.json` files) or the plugin (`asketch2sketch`) make sure to test your changes in Sketch
- [ ] Please run `npm test` on your branch to make sure that all tests are passing
- [ ] After you open a PR, make sure that all tests are passing on Travis (e.g. e2e tests can pass locally and fail on Travis sometimes)
