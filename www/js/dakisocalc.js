'use strict';

// this creates our angular app module with it's dependencies
angular.module('DakIsoCalc', ['ngRoute', /*'ngTouch',*/ 'ngSanitize', 'nl.vanwylick', 'angularLocalStorage', 'ngDropdowns']);

// some configuration for our app module
angular.module('DakIsoCalc').config(
	function($routeProvider) {
	    
		//$scope.$broadcast('app_started');
		
		$routeProvider.when('/', {
	      templateUrl: 'views/home.html',
	      controller: 'HomeCtrl'
	    });
	    $routeProvider.otherwise({redirectTo: '/'});

	}
);

/*angular.module('DakIsoCalc').run(
	function($rootScope) {
		console.log('DakIsoCalc run');
		$rootScope.$broadcast('run_dakisocalc');
	}
);*/
