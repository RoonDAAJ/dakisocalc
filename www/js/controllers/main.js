'use strict';

angular.module('DakIsoCalc').controller('MainCtrl', 
	function($scope, $rootScope, $window, $timeout) {
		
		$rootScope.title = 'C-EPS Calculator';
		$rootScope.mode = 'home';
		$rootScope.layers = true;
		
		$rootScope.has_internet = true;
		document.addEventListener("online", function() {
			console.log('app is online');
			$rootScope.has_internet = true;
		}, false);
		document.addEventListener("offline", function() {
			console.log('app is offline');
			$rootScope.has_internet = false;
		}, false);
		
		
		$scope.$on('show_form', function(event, args) {
			$rootScope.mode = 'form';
		});
		
		$scope.$on('show_settings', function(event) {
			$rootScope.mode = 'settings';
		});
		
		$scope.$on('show_menu', function(event) {
			$rootScope.mode = 'menu';
		});

		$scope.$on('show_send', function(event) {
			
			if (!$rootScope.has_internet) {
				event.preventDefault(); // this stops event from descending downwards
				$scope.$broadcast('notify_msg', 'no_internet.html');
				return;
			}
			else {
				$rootScope.mode = 'send';				
			}
		});
		
		$scope.$on('logo_action', function() {

			switch ($rootScope.mode) {
				case 'home':
					$rootScope.mode = 'menu';
					break;
				case 'menu':
					$rootScope.mode = 'home';
					break;
				case 'form':
				case 'settings':
				case 'send':
					console.log('broadcast cancel_'+ $rootScope.mode);
					$scope.$broadcast('cancel_'+ $rootScope.mode);
					$rootScope.mode = 'home';
					break;
			}
		});
		
		$scope.hideKeyboard = function() {
			console.log('trying to hide keyboard now...');
			if (document.activeElement) {
				document.activeElement.blur();
			}
			var inputs = document.querySelectorAll('input');
		    angular.forEach(inputs, function(val) {
				val.blur(); 
		    });
		};
		
		$scope.scrollIntoView = function(selector) {

			var inputs = document.querySelectorAll('input,textarea');
			var container_el = document.querySelector(selector);
			angular.forEach(inputs, function(input) {
				
				//Êdisable automatically scrolling to focused field 
				// because setting device-height property in viewport solves that issue.
				angular.element(input).bind('focus', function(e) {
					//console.log('scrolling to focus field');
					//this.scrollIntoView();
					//console.log(e.target.offsetTop, container_el.scrollTop);
					var offsetTop = e.target.offsetTop;
					//$timeout(function() {
						container_el.scrollTop = Math.max(offsetTop-16, 0); // 16 is to show the label
					//},1000);
				});
				angular.element(input).bind('blur', function(e) {
					//this.scrollIntoView();
					//console.log(e.target.offsetTop, mainview_el.scrollTop);
					$timeout(function() {
						var focus_el = document.querySelector('input:focus, textarea:focus');
						if (!focus_el) {
							container_el.scrollTop = 0;
						}
					},100);
					
				});
			});
		};
		
		$scope.$on('show_version', function(event) {
			$scope.$broadcast('info_msg', 'version.html');
		});
	}
);