'use strict';

var bind = require('mout/function/bind'),
	forEach = require('mout/array/forEach'),
	isFunction = require('mout/lang/isFunction'),
	isString = require('mout/lang/isString');

var transitions = require('./transitions');

/**
 * Create new slides instance
 * @param {Element} el
 * @param {Object} options
 */
var Slides = function(el, options){
	if (!(this instanceof Slides)) return new Slides(el, options);

	this.el = isString(el) ? document.querySelector(el) : el;
	this.parseOptions(options);
	this.createSlides();
	this.loop();
};

require('inherits')(Slides, require('events').EventEmitter);

/**
 * Parse given options object
 */
Slides.prototype.parseOptions = function(options){
	options = options || {};
	var interval = parseInt(options.interval, 10),
		transition;

	if (isFunction(options.transition)){
		transition = options.transition;
	} else {
		transition = transitions[options.transition && transitions[options.transition] ? options.transition : 'css3'];
	}

	this.options = {
		selector: options.selector || '.slide',
		initial: options.initial || 0,
		shown: options.shown || 1,
		selected: options.selected || 1,
		loop: options.loop === true,
		interval: !isNaN(interval) ? interval : 3000,
		transition: transition,
		transitionOptions: options.transitionOptions
	};
};

/**
 * Create slides
 */
Slides.prototype.createSlides = function(){
	this.slides = [];

	var slides = this.el.querySelectorAll(this.options.selector),
		i, len = slides.length;

	for (i = 0; i < len; i++){
		this.slides.push(new this.options.transition({
			element: slides[i],
			parent: this.el,
			shown: this.options.shown,
			options: this.options.transitionOptions
		}));

		this.slides[i].hide(true, i < this.options.initial ? '+' : '-');
	}

	this.to(this.options.initial, true, true);
};

/**
 * Set options after slideshow has been created
 */
Slides.prototype.setOptions = function(options){
	this.options.shown = options.shown || 1;
	this.options.selected = options.selected || 1;

	for (var i = 0; i < this.slides.length; i++){
		if (this.slides[i].setShown){
			this.slides[i].setShown(this.options.shown);
		}
	}

	this.to(this.active || this.options.initial, true);
};

/**
 * Loop the slides
 */
Slides.prototype.loop = function(){
	if (!this.options.loop) return;

	var self = this;
	clearTimeout(this.timeout);
	this.timeout = setTimeout(function(){
		requestAnimationFrame(function(){
			self.next();
		});
	}, this.options.interval);
};

/**
 * Go to the previous slide
 */
Slides.prototype.previous = function(){
	var index = this.active - 1;
	if (index < 0){
		index = this.slides.length - 1;
	}
	this.to(index);
};

/**
 * Go to the next slide
 */
Slides.prototype.next = function(){
	var index = this.active + 1;
	if (index > this.slides.length - 1){
		index = 0;
	}
	this.to(index);
};

/**
 * Go to a slide by index
 * @param {Number} index
 */
Slides.prototype.to = function(index, instant, suppress){
	index = parseInt(index, 10);
	if (!this.slides[index] || (index == this.active && !instant)) return;

	var first = (index - this.options.selected) + 1,
		last = first + this.options.shown,
		i, shown = [], direction, pos = 0;

	if (first < 0){
		first = 0;
		last = this.options.shown;
	}

	if (last > this.slides.length){
		first = Math.max(this.slides.length - this.options.shown, 0);
		last = this.slides.length;
	}

	direction = this.active < index ? '+' : '-';

	if (this.shown){
		forEach(this.shown, bind(function(i){
			if (i < first || i >= last){
				this.slides[i].hide(instant, direction);
			}
		}, this));
	}

	for (i = first; i < last; i++){
		shown.push(i);
		this.slides[i].show(instant, direction, pos++, i == index);
	}

	if (!suppress){
		this.emit('change', index, this.active, direction);
	}

	this.active = index;
	this.shown = shown;

	this.loop();
};

module.exports = Slides;
