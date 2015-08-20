'use strict';

angular.module('DakIsoCalc').controller('HomeCtrl', 
	function($scope, $rootScope, $route, $routeParams, $location, calculator, $window, storage, $filter, $timeout) {
	
		$scope.data = { 
			'A': {
				templateUrl: 'snippets/form_a.html',
				title: 'Punt A<sub>1</sub>',
				height:''
			},
			'B': {
				templateUrl: 'snippets/form_b.html',
				title: 'Punt B<sub>hwa</sub>',
				height:''
			},
			'AA': {
				templateUrl: 'snippets/form_aa.html',
				title: 'Punt A<sub>2</sub>',
				height:''
				},
			'C': {
				templateUrl: 'snippets/form_c.html',
				title: 'Punt C',
				height:''
			}
		};
		
		$scope.$on('show_form', function(event, args) {
			var point = args.length ? args[1] : 'A';
			$rootScope.title = $scope.data[point].title;
			$rootScope.point = point;
			$scope.entry_template = $scope.data[point].templateUrl;
			$scope.data[point].height = calculator.settings[point].height;
		});
		
		$scope.$on('confirm_form', function(event, args) {
			var point = $rootScope.point;//.toUpperCase();
			calculator.settings[point].height = $scope.data[point].height;
			calculate();
			go_home();
		});
		
		$scope.show_result = false;
		$scope.calc_result = null;
		function calculate() {
			if (calculator.ready_to_calculate()) {
				$scope.calc_result = calculator.calculate();
				$scope.show_result = true;
			}
			else {
				$scope.calc_result = null;
				$scope.show_result = false;
			}
		}
		
		$scope.$on('confirm_settings', function(event) {
			
			console.log('confirm_settings called');
			//console.log($scope);
			
			if ($rootScope.settingsform_scope && $rootScope.settingsform_scope.settingsform.$invalid) {
				$rootScope.settingsform_scope.settingsform.showerrors = true;
				console.log('settingsform is invalid, fix that!');
				return;
			}
			//console.log($scope);
			//console.log($rootScope.settingsform_scope);
			calculator.settings.material = angular.copy($scope.material);
			
			calculator.settings.dimension.l = $scope.dimension_l;
			calculator.settings.dimension.w = $scope.dimension_w;
			calculator.settings.material.lambda = $scope.lambda;
			calculator.settings.betopor.lambda = $scope.betopor_lambda;
			calculator.settings.betopor.width_seam = $scope.width_seam;
			calculator.settings.betopor.height = $scope.betopor_height;
						
			calculate();
			go_home();
		});
		
		$scope.initsendform = function(scope) {
			$rootScope.sendform_scope = scope;
			$scope.scrollIntoView('.send-form');
		};
		$scope.initsettingsform = function(scope) {
			$rootScope.settingsform_scope = scope;
			$scope.scrollIntoView('.settings-dialog');
		};
		$scope.initentryform = function(scope) {
			$scope.scrollIntoView('.entry-form');
		};
		
		$scope.$on('send_mail', function(event) {
			
			if ($rootScope.sendform_scope.sendform.$invalid) {
				$rootScope.sendform_scope.showerrors = true;
				console.log('sendform is invalid, fix that!');
				return;
			}

			//reset scroll position automatically set by $scope.scrollIntoView(...)
			//document.querySelector('.send-form').scrollTop = 0; 

			var my_vars=[];
			my_vars.push({ name: 'A_Height', content: $scope.calc_result.A.height });
			my_vars.push({ name: 'B_Height', content: $scope.calc_result.B.height });
			my_vars.push({ name: 'C_Height', content: $scope.calc_result.C.height });
			my_vars.push({ name: 'AA_Height', content: $scope.calc_result.AA.height });
			
			my_vars.push({ name: 'Material_Name', content: $scope.calc_result.material.name });
			my_vars.push({ name: 'Material_Dimension_Length', content: $scope.calc_result.dimension.l });
			my_vars.push({ name: 'Material_Dimension_width', content:  $scope.calc_result.dimension.w });
			my_vars.push({ name: 'Material_lambda', content: $filter('number')($scope.calc_result.material.lambda,3) });
			my_vars.push({ name: 'Seam_width', content: $scope.calc_result.betopor.width_seam });
			my_vars.push({ name: 'betopor_lambda', content: $filter('number')($scope.calc_result.betopor.lambda,3) });
			my_vars.push({ name: 'betopor_height', content: $scope.calc_result.betopor.height  });
			
			my_vars.push({ name: 'result_rm', content: $filter('number')($scope.calc_result.Rm,2) });
			my_vars.push({ name: 'result_lambda', content: $filter('number')($scope.calc_result.lambda,3) });
			my_vars.push({ name: 'result_height_avg', content: $filter('number')($scope.calc_result.height_avg,0) });

			angular.forEach($scope.send, function(val, key) {
				//console.log(val,key);
				var formatted_val = isNumber(val) ? val : $filter('nl2br')(val);
				my_vars.push({
					name: key,
					content: formatted_val
				});
			});
			
			
			var m = new mandrill.Mandrill('WEZjAggupJzZMVQPVozhxw', true);
			m.messages.sendTemplate({
					template_name: "c-eps-calculator-isolatieberekening",
					template_content: {},
					message : {
						to: [
						     {
						    	 email: $scope.send.email,
						    	 name: $scope.send.name,
						    	 type: 'to'
						     }
						],
						merge_vars: [
							{
								rcpt: $scope.send.email,
								vars: my_vars
							}
						],
						inline_css: true,
						images:[
							    {
							    	type: 'image/jpeg',
							    	name: 'logo',
							    	content: "/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjUxRUZCNTE0NkFDNTExRTJBQUQxRjQyNTQyNjI4QUNDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjUxRUZCNTE1NkFDNTExRTJBQUQxRjQyNTQyNjI4QUNDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTFFRkI1MTI2QUM1MTFFMkFBRDFGNDI1NDI2MjhBQ0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTFFRkI1MTM2QUM1MTFFMkFBRDFGNDI1NDI2MjhBQ0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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"
							    }        
							]
					}
				},
				function(res) {
					console.log(res);
				},
				function (err) {
					console.log(err);
				}
			);
			
			//$scope.$emit('error_msg', 'Geen Internet Connectie! Kan email niet versturen');
			go_home();
		});
		
		function isNumber(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		}
		
		$scope.$on('show_settings', function(event) {
			$scope.entry_template = '';
			$rootScope.title = 'Instellingen';
			
			// reset settings values possible change but not applied
			$scope.material = calculator.settings.material;
			for (var i = 0; i < $scope.materials.length; i++) {
				var material = $scope.materials[i];
				if ($scope.material.type == material.type) {
					$scope.material = material;
					break;
				}
			}
			$scope.dimension_l = calculator.settings.dimension.l;
			$scope.dimension_w =calculator.settings.dimension.w;
			$scope.lambda = calculator.settings.material.lambda;
			$scope.betopor_lambda = calculator.settings.betopor.lambda;
			$scope.width_seam = calculator.settings.betopor.width_seam;
			$scope.betopor_height = calculator.settings.betopor.height;
		});
		
		$scope.$on('show_send', function(event) {
			
			// only continue when flag is not set
			if (event.defaultPrevented) return;
			
			$rootScope.title = 'Versturen Berekening';
		});
		
		$scope.$on('show_layers', function(event) {
			$rootScope.layers = !$rootScope.layers;
		});

		$scope.$on('cancel_form', function(event) {
			go_home();
		});
		
		$scope.$on('cancel_settings', function(event) {
			go_home();
		});
		
		$scope.$on('cancel_send', function(event) { 
			go_home();
		});

		$scope.$on('start_intro', function(event) {
			go_home();
		});

		$scope.$on('show_version', function(event) {
			go_home();
		});

		function go_home() {
			console.log('go_home called');
			if ($rootScope.mode == 'home') return;
			
			$rootScope.mode = 'home';
			$rootScope.title = 'C-EPS Calculator';
			$scope.hideKeyboard();
		}
		
	/*	$scope.$watch('material', function(new_value, old_value) {
			console.log('watch fired changing from -> to');
			console.log(old_value, new_value);
			if (new_value == old_value) return;
			
			$scope.refreshing = true;
			$timeout(function() {
				$scope.refreshing = false;
			},750);

			$scope.dimension_l = angular.copy(new_value.dimensions[0].l);
			$scope.dimension_w =angular.copy(new_value.dimensions[0].w);
			$scope.lambda = angular.copy($scope.material.lambda);
		});*/
		
		$scope.change_material = function(selected) {
			
			// highlights the fields being changed by selecting material
			$scope.refreshing = true;
			$timeout(function() {
				$scope.refreshing = false;
			},750);
			
			$scope.material = angular.copy(selected);
			$scope.dimension_l = angular.copy(selected.dimensions[0].l);
			$scope.dimension_w =angular.copy(selected.dimensions[0].w);
			$scope.lambda = angular.copy(selected.lambda);
		};
		
		$scope.restore_material_values = function() {
			
			$scope.refreshing = true;
			$timeout(function() {
				$scope.refreshing = false;
			},750);
			
			$scope.dimension_l = angular.copy($scope.material.dimensions[0].l);
			$scope.dimension_w =angular.copy($scope.material.dimensions[0].w);
			$scope.lambda = angular.copy($scope.material.lambda);
		};
		
		
		function rescale_pointslayer() {
			var points_el = document.querySelector('.points');
			//console.log('resize window causes resize points layer', $window.innerWidth);
			var height = parseInt(window.getComputedStyle(points_el,null).getPropertyValue("height"));
			//console.log(height);
			var width = (height/895)*2048; // 2048x895 is dimension of rooftop image and other layers.
			//console.log(width);
			points_el.style.width = parseInt(width) +'px';
			//return $scope.$apply();
		}
		
		function init() {
			console.log('scope when init is called:'+ $scope.$id);
			
			// quick fix to show icons correctly on mobile phone as it 
			// appears the div with points is not automatically resized to 
			// width of parent container (possible bug in webkit browsers).
			angular.element($window).bind('resize', rescale_pointslayer);
			rescale_pointslayer();
			
			$scope.entry_template = $scope.data['A'].templateUrl;
			$scope.rooftop_styles = {};

			angular.forEach(['A','B','C','AA'], function(value) {
				storage.bind($scope, 'data.'+ value +'.height');
				calculator.settings[value].height = $scope.data[value].height;
			});

			// make sure selected and stored material is reselected upon init 
			$scope.materials = calculator.get_material();
			storage.bind($scope, 'material', { defaultValue: $scope.materials[1] }); // default selected material is the EPS100
			for (var i = 0; i < $scope.materials.length; i++) {
				var material = $scope.materials[i];
				if ($scope.material.type == material.type) {
					$scope.material = material;
					break;
				}
			}

			storage.bind($scope, 'dimension_l', {defaultValue: $scope.materials[1].dimensions[0].l}); // take default dim from EPS100
			storage.bind($scope, 'dimension_w', {defaultValue: $scope.materials[1].dimensions[0].w}); // take default dim from EPS100
			storage.bind($scope, 'lambda', {defaultValue: $scope.material.lambda});
			storage.bind($scope, 'betopor_lambda', {defaultValue: calculator.settings.betopor.lambda});
			storage.bind($scope, 'width_seam', {defaultValue: calculator.settings.betopor.width_seam});
			storage.bind($scope, 'betopor_height', {defaultValue: calculator.settings.betopor.height});
			
			// this var is used to store the values entered when sharing the calculation via email
			storage.bind($scope, 'send', { defaultValue: {} });
			
			$scope.calculator = calculator;
			
			$scope.$broadcast('confirm_settings'); // only used to calculate and copy scope values to calculator.
		}
		init();

		$scope.$on('reset_calculator', function(event) {
			storage.remove('data.A.height');
			storage.remove('data.B.height');
			storage.remove('data.AA.height');
			storage.remove('data.C.height');
			//storage.clearAll();
			init();
		});
	}
);