angular.module('DakIsoCalc').directive('resizable', function($window) {
  return function($scope) {
    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      return $scope.windowWidth = $window.innerWidth;
    };
    $scope.initializeWindowSize();
    return angular.element($window).bind('resize', function() {
      //console.log('resizing to '+ $scope.windowWidth +'x'+ $scope.windowHeight);
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  };
});