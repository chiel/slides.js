'use strict';

var $ = require('elements');
require('moofx');

var Slide = function(params){
	this.el = $(params.element);
	this.options = params.options || {duration: 250};
};

Slide.prototype.hide = function(instant){
	if (instant){
		this.el.style({display: 'none'});
		return;
	}

	var self = this;
	this.el.style({zIndex: 3}).animate({opacity: 0}, {
		duration: this.options.duration,
		callback: function(){
			self.el.style({zIndex: 1});
		}
	});
};

Slide.prototype.show = function(){
	this.el.style({
		display: 'block',
		opacity: 1,
		zIndex: 2
	});
};

module.exports = Slide;
