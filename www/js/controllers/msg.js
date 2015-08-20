'use strict';

angular.module('DakIsoCalc').controller('MsgCtrl', 
	function($scope, $rootScope) {

		var template_base = 'snippets/msgs/';
		$scope.showmsg = false;
		$scope.msg = {};
		
		$scope.$on('close_msg', function(event) {
			$scope.showmsg = false;
		});
		
		$scope.$on('error_msg', function(event, msg) {
			$scope.msg = get_msg_object(msg, 'error');
			console.log('error:'+ $scope.msg.message);
			$scope.showmsg = true;
		});
		
		$scope.$on('info_msg', function(event, msg) {
			$scope.msg = get_msg_object(msg, 'info');
			console.log('info:'+ $scope.msg.message);
			$scope.showmsg = true;
		});
		
		$scope.$on('notify_msg', function(event, msg) {
			$scope.msg = get_msg_object(msg, 'notify');
			console.log('notify:'+ $scope.msg.message);
			$scope.showmsg = true;
		});
		
		function get_msg_object(msg, type) {
			// if already an object just return it
			if (msg instanceof Object) {
				return msg;
			}
			
			// msg is not an objectm, create one from message
			var msg_obj = {
				autoclose:false
			};
			if (msg) {
				// if no type it's 'info'
				msg_obj.type = type ? type : 'info';
				
				// determine whether template file is specified. if so,
				// prefix this with path to template 
				if (msg.indexOf('.html')) {
					msg_obj.template = template_base + msg;
				}
				else {
					msg_obj.message = msg;
				}
				
				// decide which buttons to show based on type of message
				switch (msg_obj.type.toLowerCase()) {
					case 'info':
					case 'error': 
						msg_obj.buttons = [{
							label:'Ok',
							css_class:'button ok',
							action: 'close_msg'
						}];
					break;
					case 'notify': 
						msg_obj.autoclose = 4000;
					break;
				}
			}
			// all done, return object
			return msg_obj;
		}
	}
);
