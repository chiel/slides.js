'use strict';

var $ = require('elements'),
	prime = require('prime'),
	bind = require('mout/function/bind'),
	forEach = require('mout/array/forEach'),
	isFunction = require('mout/lang/isFunction');

var transitions = require('./transitions');

var Slides = prime({
	inherits: require('prime/emitter'),

	/**
	 * @param {Element} el
	 * @param {Object} options
	 */
	constructor: function(el, options){
		this.el = $(el);
		this.parseOptions(options);
		this.cacheElements();
		this.loop();
	},

	/**
	 *
	 */
	parseOptions: function(options){
		options = options || {};
		var interval = parseInt(options.interval, 10),
			transition;

		if (isFunction(options.transition)){
			transition = options.transition;
		} else {
			transition = transitions[options.transition && transitions[options.transition] ? options.transition : 'fade'];
		}

		this.options = {
			selector: options.selector || '.slide',
			initial: options.initial || 0,
			shown: options.shown || 1,
			selected: options.selected || 0,
			loop: options.loop === true,
			interval: !isNaN(interval) ? interval : 3000,
			transition: transition,
			transitionOptions: options.transitionOptions
		};
	},

	/**
	 *
	 */
	cacheElements: function(){
		this.slides = [];

		var slides = this.el.search(this.options.selector),
			i, len = slides.length;

		for (i = 0; i < len; i++){
			this.slides.push(new this.options.transition({
				element: slides[i],
				parent: this.el[0],
				shown: this.options.shown,
				options: this.options.transitionOptions
			}));

			this.slides[i].hide(true, i < this.options.initial ? '+' : '-');
		}

		this.to(this.options.initial, true);
	},

	/**
	 * Loop the slides
	 */
	loop: function(){
		if (!this.options.loop) return;

		var self = this;
		clearTimeout(this.timeout);
		this.timeout = setTimeout(function(){
			self.next();
		}, this.options.interval);
	},

	/**
	 * Go to the previous slide
	 */
	previous: function(){
		var index = this.active - 1;
		if (index < 0){
			index = this.slides.length - 1;
		}
		this.to(index);
	},

	/**
	 * Go to the next slide
	 */
	next: function(){
		var index = this.active + 1;
		if (index > this.slides.length - 1){
			index = 0;
		}
		this.to(index);
	},

	/**
	 * Go to a slide by index
	 * @param {Number} index
	 */
	to: function(index, instant){
		index = parseInt(index, 10);
		if (!this.slides[index] || index == this.active) return;

		var first = (index - this.options.selected) + 1,
			last = first + this.options.shown, i, shown = [], direction, pos = 0;

		if (first < 0){
			first = 0;
			last = this.options.shown;
		}

		if (last > this.slides.length){
			first = this.slides.length - this.options.shown;
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

		this.emit('change', index, this.active, direction);
		this.active = index;
		this.shown = shown;

		this.loop();
	}
});

module.exports = Slides;
