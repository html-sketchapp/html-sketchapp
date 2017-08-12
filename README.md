# html-sketchapp

*Experimental* HTML to Sketch export solution.

## What it can do?

It turns HTML nodes into Sketch layers or symbols. Additionally, it allows to export shared text styles and document colors.

<img src="https://i.imgur.com/yPjMwFU.png" width="100%" />

## Why?

The motivation behind this project was ability to easily share Front-End style guide with our Design team. Although similar project, [react-sketchap](https://github.com/airbnb/react-sketchapp), already exists it does require you to:

- use React,
- build everything using generic components (`<View>`, `<Text>`, `<Image>`),
- and keep your styles in JS.

We were unable to quickly work around these limitations, so we created html-sketchapp.

## Why experimental?

This project is a prototype that allowed us to export most of our Front-End style guide to Sketch. The main focus was on exporting the style guide and not on providing a complete solution, therefore there are quite a few known limitations:

- not all CSS properties are supported (TODO)
- not all values for supported CSS properties are supported (TODO)
- not all types of images are supported (webp, svg) (TODO)
- resizing information are not generated (TODO)
- requires MacOS (Sketch's limitation)

The good news is that most of the missing functionality should be fairly easy to add - feel free to fork this project.

## How it works?

Ideally, this project should be an, OS independent, NodeJS library that alows to crate valid Sketch files. Unfortunatelly, it's not possible at this point due to Sketch format limitations.

Current solution consists of two parts. First one (`html2asketch`), runs in a browser (either regular or headless) and creates an *almost* valid sketch file (`.asketch`). Second one (`asketch2sketch`), takes that file and imports it into Sketch. Why two parts? They are built in different technologies and run in different environments. `html2asketch` is written in JS and runs in a browser where it can easily extract all information from DOM nodes: their position, size, styles and children. Extracted information are then translated into Sketch's `document.json` and `page.json` files. Unfortunately, ATM Sketch file format is not fully readable and some parts can't be easily generated from JavaScript (most notably text styling information which is saved as a binary blob). Additionally, script running in the browser is limited by CORS and may not be able to download all of the images used on page. That's where we need `asketch2sketch`. It is a [cocoascript](http://developer.sketchapp.com/introduction/cocoascript/) (JavaScript + Objective-C) run via NodeJS. It "fixes" `asketch` files (changes text styling information format, downloads and inlines images) and loads them into the Sketch app.

## How do I run it?

`html2asketch` consists of multiple JS classes and methods that you can use to extract specific parts of the website and save them as layers, shared text styles, document colors and symbols. There is no one right way of using `html2asketch`. You can build your solution based on the example script included `html2asketch/examples/page2layers.js` which saves whole page as a set of layers. In order to build it:

```
cd html2asketch
npm i
npm run build-example
```

You can then inject the built file (`html2asketch/examples/build/page2layers.bundle.js`) into any webpage using a regular or headless browser (preferably Chrome 60+, in which this solution was tested). Script will produce a json output which should be copied to `asketch2sketch/import/page.askech.json`. (Later on, if you'll also create a document, copy it to `asketch2sketch/import/document.asketch.json`). With asketch files in place, we can run `asketch2sketch`:

```
cd asketch2sketch
npm i
npm run render
```

This should open [Sketch](https://sketchapp.com/) (make sure you have it installed!) and render exported HTML information. From there, you can save your project as a sketch file and share with others.

## Thanks!

This project uses parts of the fantastic [react-sketchapp](https://github.com/airbnb/react-sketchapp) and wouldn't be possible without [skpm](https://github.com/skpm/skpm) and information from [Sketch-Headers](https://github.com/abynim/Sketch-Headers).
