# slides.js

slides.js is a small, modular library which helps you to create
slideshow/carousel-like implementations.

*Please note that this is a pre-1.0 release and as such the API should be
considered unstable at this point.*

## Installation

Currently, slides.js is only available from npm. You can use a tool such as
[browserify][browserify] or [wrapup][wrapup] in your build process to make it
available in the browser.

```bash
$ npm install --save slides-js
```

In the future, slides.js will be available from bower as well.


## Usage

The simplest instantiation of slides.js would look a little like this:

```js
var Slides = require('slides-js');
var slides = new Slides(document.querySelector('.slides'));
```

This will look for elements with the `.slide` selector inside the passed element
and apply transitions to them. From then, you can call `.next()` and a few other
methods on the slides instance - these will be detailed below.


## Options

The constructor takes an `options` object as its second argument. Below is a
description of each option, along with the defaults.

- `slideSelector` - selector to use to find slides, defaults to `'.slide'`
- `navSelector` - selector to use to find nav elements, defaults to `undefined`
- `interval` - time (in milliseconds) to wait between each slide transition
- `loop` - whether the slideshow automatically loops, defaults to `true`
- `hover` - whether slides should be shown on nav hover rather than click,
  defaults to `false`
- `transition` - which transition to use, defaults to `'fade'`, custom
  transitions can be used too, how to do this is detailed below
- `transitionOptions` - options passed directly to the transition instance,
  defaults to `{duration: 150}`


## Instance methods

Once your slides.js instance has been created, a few methods can be called:

- `next` - transition to the next slide, this will automatically loop around
  back to the beginning once the end is reached
- `previous` - transition to previous slide, this will automatically loop around
  back to the end once the beginning is reached
- `to` - transition to slide by index, if no slide exists on the given index
  nothing happens


## Custom transitions

It is possible to create custom transitions if you wish, you can do this by
passing a transition function to the `transition` option. For example:

```js
var Slide = function(element, options){
  this.element = element;

  // since the options get passed through directly
  // from the main instance you can use whatever
  // options suit your transition
  this.options = options;
};

Slide.prototype.hide = function(instant, direction){
  this.element.style.display = 'none';
};

Slide.prototype.show = function(instant, direction){
  this.elment.style.display = 'block';
};

var Slides = require('slides-js');
new Slides(document.querySelector('.slides'), {
  transition: Slide
});
```

The above illustrates the simplest transition possible, simply showing and
hiding without a transition. As you can see, a transition instance should have 3
methods that can be called:

- `constructor` - the transition objects are always called with `new`
  - `element` - the slide element, this is regular DOM element
  - `options` - the options for the transition, passed directly from the Slides
    options object
- `hide` - hide the slide
  - `instant` - whether or not the transition should be instant, this is useful
    for initial pageload when the slides get loaded for the very first time.
    Usually you don't want to show a transition right on pageload.
  - `direction` - this is either `+` or `-` and can help you determine which
    direction your transition needs to go
- `show` - show the slide, this function receives the same arguments as `hide`
