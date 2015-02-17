'use strict';

/**
 * New css3 transition slide
 * @param {Object} params
 */
var Slide = function(params){
	this.el = params.element;
};

/**
 * Transition end for when fade finishes
 */
Slide.prototype.transitionEnd = function(){
	this.el.style.zIndex = 1;
};

/**
 * Hide this slide
 * @param {Boolean} instant
 */
Slide.prototype.hide = function(instant){
	if (instant){
		this.el.style.display = 'none';
		this.el.style.zIndex = 1;
		return;
	}

	var self = this;
	var transitionEnd = function(){
		self.el.removeEventListener('transitionend', transitionEnd);
		self.el.style.display = 'none';
		self.el.style.zIndex = 1;
	};

	this.el.addEventListener('transitionend', transitionEnd);
	this.el.style.zIndex = 3;
	this.el.classList.remove('is-active');
};

/**
 * Show this slide
 */
Slide.prototype.show = function(){
	this.el.style.display = 'block';
	this.el.classList.add('is-active');
};

module.exports = Slide;
