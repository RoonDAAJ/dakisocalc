'use strict';

var vanwylick = angular.module('nl.vanwylick', []);

angular.module('nl.vanwylick')
.factory('appdata', function() {
	
	var appdata = function() {
		this.points = {
			'A' : { height:0 },
			'B' : { height:0 },
			'C' : { height:0 },
			'AA': { height:0 }
		};
	};
	
	appdata.prototype = {
		init : function() {
			
		}
	};
	
	var o = new appdata();
	o.init();
	return o;
});