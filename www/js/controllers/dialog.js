'use strict';

angular.module('DakIsoCalc').controller('DialogCtrl', 
	function($scope, storage) {

		$scope.current_step = 1;
		$scope.show_on_startup = storage.get('show_on_startup');
		$scope.showdlg  = $scope.show_on_startup;
		
		$scope.steps = [{
				title: 'Welkom',
				description: 
					'De C-EPS calculator rekent op basis van de dikte van 4 punten op een plat dak '+ 
					'de <b>R<sub>m</sub></b>, <b>&lambda;</b> en <b>gemiddelde dikte</b> voor u uit. <br/>'+
					'<br/>'+
					'Volg deze korte introductie en ga vervolgens aan de slag!<br/>'+
					'<br/>'
			},
			{	title: 'Op het dak',
				description: 'U ziet dadelijk een foto van een platdak. Afhankelijk van de grootte van '+
					'uw beeldscherm ziet u het gehele dak of maar een gedeelte ervan. In het laatste geval '+
					'kunt u zich verplaatsen over het dak door de foto naar rechts of links te schuiven met uw '+
					'vinger.'
			},
			{	title: 'Invoeren',
				description: 'Op de foto van het dak vindt u 4 punten gemarkeerd met rode pinnen. Wanneer u een punt '+
					'aantikt met uw vinger dan verschijnt er een invoer venster waar u de dikte van dat punt kunt invoeren. '
			},
			{	title: 'Resultaat',
				description: 'Wanneer u de diktes van alle vier de punten heeft ingevoerd dan verschijnt automatisch '+
					'het resultaat van de berekening. Deel de berekening met andere via het envelop icoon.'
			}

		];
		
		$scope.$on('start_intro', function(event) {
			$scope.showdlg = true;
		});
		
		$scope.$on('close_dlg', function(event) {
			$scope.showdlg = false;
			$scope.current_step = 1;
			storage.set('show_on_startup', $scope.show_on_startup);
		});
		
		$scope.$on('go_prev', function(event) {
			$scope.current_step = Math.max(1, $scope.current_step - 1);
		});
		
		$scope.$on('go_next', function(event) {
			$scope.current_step = Math.min($scope.steps.length, $scope.current_step + 1);
		});
	}
);
