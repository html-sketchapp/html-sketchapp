# html-sketchapp [![Build Status](https://travis-ci.org/brainly/html-sketchapp.svg?branch=master)](https://travis-ci.org/brainly/html-sketchapp) [![npm version](https://badge.fury.io/js/%40brainly%2Fhtml-sketchapp.svg)](https://badge.fury.io/js/%40brainly%2Fhtml-sketchapp)

HTML to Sketch export solution.

## What it can do?

html-sketchapp turns HTML nodes into Sketch layers or symbols. Additionally, it allows to export shared text styles and document colors.

<img src="https://i.imgur.com/yPjMwFU.png" width="100%" />

## Why?

The motivation behind this project was ability to easily share Front-End style guide with our Design team. Although similar project, [react-sketchapp](https://github.com/airbnb/react-sketchapp), already exists it does require you to:

- use React,
- build everything using generic components (`<View>`, `<Text>`, `<Image>`),
- and keep your styles in JS.

We were unable to quickly work around these limitations, so we created html-sketchapp.

You can learn more about this project from:
- [our wiki](https://github.com/brainly/html-sketchapp/wiki),
- and the excellent article ["Sketching in the Browser"](https://medium.com/seek-blog/sketching-in-the-browser-33a7b7aa0526) by @markdalgleish.

## Limitations

Comprehensive summary of what is, and what is not supported can be found [here](https://github.com/brainly/html-sketchapp/wiki/What's-supported%3F), but the TLDR is as follows:

- pseudoelements are not supported,
- some CSS properties (e.g. overflow) are not supported or not fully supported,
- not all types of images are supported (animated gifs, webp),
- resizing information is not generated,
- all fonts have to be locally installed.

The good news is that all of those are fixable and that we welcome pull requests ❤️

## How do I run it?

### Install html-sketchapp

You can get stable version of html-sketchapp from NPM.

```sh
npm i @brainly/html-sketchapp
```

### Create .asketch files

`html2asketch` is a library that you can use to create a script that extracts specific parts of your website and saves them as layers, shared text styles, document colors and symbols. Your script then can be run in a regular or a headless browser.

There is no one right way of using `html2asketch`, but you can start by checking out the ["Usage Examples"](https://github.com/brainly/html-sketchapp/wiki/Usage-Examples) section of the wiki or the two example projects that we provide:

- [html-sketchapp-example](https://github.com/brainly/html-sketchapp-example) - minimal script that takes an URL and produces a `page.asketch.json` file
- [html-sketchapp-style-guide](https://github.com/brainly/html-sketchapp-style-guide) - script that takes parts of the Brainly style-guide and exports them as Sketch symbols, shared text styles and document colors. This script produces `document.asketch.json` and `page.asketch.json`.

*If you are wondering what are, and why we need `.asketch` files, plese see our [wiki](https://github.com/brainly/html-sketchapp/wiki/How-does-it-work%3F).*

### Import .asketch files to Sketch

All `.asketch.json` files should be loaded to Sketch via the `asketch2sketch.sketchplugin` plugin.

<img src="https://i.imgur.com/9eDm6NQ.png" width="450" alt="Installing Sketch plugin" title="Installing Sketch plugin" />

You can download ready to use Sketch plugin from the ["Releases"](https://github.com/brainly/html-sketchapp/releases/latest) section, or build it yourself from the sources:

```
npm i # install dependencies
npm run build # build the plugin
```

## Projects using html-sketchapp

- [html-sketchapp-cli](https://github.com/seek-oss/html-sketchapp-cli) - "Quickly generate Sketch libraries from HTML documents and living style guides."
- [story2sketch](https://github.com/chrisvxd/story2sketch) - "Convert Storybook stories into Sketch symbols."

## Standing on the shoulders of giants :heart:

This project uses huge bits and pieces from the fantastic [react-sketchapp](https://github.com/airbnb/react-sketchapp) and wouldn't be possible without [skpm](https://github.com/skpm/skpm) and information from [Sketch-Headers](https://github.com/abynim/Sketch-Headers).
