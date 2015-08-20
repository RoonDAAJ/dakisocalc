angular.module('DakIsoCalc').directive('citToolbar', 
	function() {
		return { 
			restrict: 'E',
			replace: true,
			templateUrl: 'snippets/toolbar.html',
			controller: function($scope, $rootScope, calculator) {
								
				$scope.fire = function(id) {
					console.log('fire '+ id);
					$scope.$broadcast(id, arguments);
				};
			}
		};
	}
);