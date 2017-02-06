'use strict'

app.controller('RoomCtrl', function($scope, $routeParams, $http) {
	var roomId = $routeParams.roomId;

	$scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        timezone: 'local',
        header:{
          left: 'month agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        eventClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    $scope.eventSources = [];

    $scope.startDate = new Date();
    $scope.start = new Date();
    $scope.end = new Date();

	$http({
	  method: 'GET',
	  url: '/rooms/' + roomId
	}).then(function successCallback(response) {
	    $scope.room = response.data;
	    
	    $http({
		  method: 'GET',
		  url: '/reservations/' + roomId
		}).then(function successCallback(response) {
		    $scope.room.reservations = response.data;
		    $scope.eventSources.push(response.data)
		}, function errorCallback(response) {
		    console.log(response);
		});
	}, function errorCallback(response) {
	    console.log(response);
	});

	$scope.sendReservation = function() {
		if (!$scope.start || !$scope.end) {
			return
		}

		var start = new Date($scope.startDate);
		start.setHours($scope.start.getHours());
		start.setMinutes($scope.start.getMinutes());
		
		var end = new Date($scope.startDate);
		end.setHours($scope.end.getHours());
		end.setMinutes($scope.end.getMinutes());

		$http({
		  method: 'POST',
		  url: '/reservations/',
		  data: {
		  	roomId: roomId,
		  	start: start,
		  	end: end
		  }
		}).then(function successCallback(response) {
		    if (response.data.err) {
		    	alert(response.data.err);
		    } else {
		    	$scope.start = new Date();
    			$scope.end = new Date();
    			if ($scope.eventSources[0].length === 0) {
    				$scope.eventSources[0] = [response.data.reservation]
    			} else {
    				$scope.eventSources[0].push(response.data.reservation)
    			}
		    }
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	$scope.handleChange = function(which) {
        $scope.start = new Date($scope.start)
        $scope.end = new Date($scope.end)
    };
});