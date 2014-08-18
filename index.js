'use strict';

var $ = require('elements'),
	prime = require('prime'),
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
		this.setEvents();

		this.current = 0;
		$(this.navEls[this.current]).addClass('active');
		this.emit('change', this.current, null, null);
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
			slideSelector: options.slideSelector || '.slide',
			navSelector: options.navSelector,
			interval: !isNaN(interval) ? interval : 3000,
			loop: options.loop === false ? false : true,
			hover: options.hover === true,
			transition: transition,
			transitionOptions: options.transitionOptions || {duration: 150}
		};
	},

	/**
	 *
	 */
	cacheElements: function(){
		this.slides = [];
		this.navEls = this.el.search(this.options.navSelector);
		var slides = this.el.search(this.options.slideSelector),
			i, len = slides.length;

		for (i = 0; i < len; i++){
			this.slides.push(new this.options.transition(
				slides[i],
				this.options.transitionOptions
			));
			if (i > 0){
				this.slides[i].hide(true);
			}
			$(this.navEls[i]).attribute('data-index', i);
		}
	},

	/**
	 *
	 */
	setEvents: function(){
		var self = this;
		this.navEls.on((this.options.hover ? 'mouseenter' : 'click'), function(e){
			e.preventDefault();
			var el = $(e.srcElement || e.target);
			self.to(parseInt(el.attribute('data-index'), 10));
		});
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
		var index = this.current - 1;
		if (index < 0){
			index = this.slides.length - 1;
		}
		this.to(index);
	},

	/**
	 * Go to the next slide
	 */
	next: function(){
		var index = this.current + 1;
		if (index > this.slides.length - 1){
			index = 0;
		}
		this.to(index);
	},

	/**
	 * Go to a slide by index
	 * @param {Number} index
	 */
	to: function(index){
		index = parseInt(index, 10);
		if (isNaN(index) || index == this.current || !this.slides[index]) return;

		var direction = this.current < index ? '+' : '-';

		$(this.navEls[this.current]).removeClass('active');
		$(this.navEls[index]).addClass('active');

		this.slides[this.current].hide(false, direction);
		this.slides[index].show(false, direction);
		this.emit('change', index, this.current, direction);
		this.current = index;

		this.loop();
	}
});

module.exports = Slides;
