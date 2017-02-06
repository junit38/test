'use strict';

var app = angular.module('app', [
		'ngRoute',
		'ngCookies',
		'ngResource',
		'ui.calendar',
	]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when("/", {
			templateUrl: "partials/index.html"
		}).
		when("/rooms", {
			templateUrl: "partials/rooms.html",
			controller: "RoomsCtrl"
		}).
		when("/rooms/:roomId", {
			templateUrl: "partials/rooms-view.html",
			controller: "RoomCtrl"
		}).
		otherwise({
			redirectTo: '/'
		});
	}]);

app.run(function($rootScope, $location) {
	$rootScope.$location = $location;
})

app.controller('RoomsCtrl', function($scope, $rootScope, $http) {
	$scope.equipements = [];
	$scope.capacities = [];

    $scope.reset = function() {
    	$scope.startDate = new Date()
    	$scope.start = null;
    	$scope.end = null;

    	$rootScope.startDate = null;
		$rootScope.start = null;
		$rootScope.end = null;

    	$http({
		  method: 'GET',
		  url: '/rooms'
		}).then(function successCallback(response) {
		    $scope.rooms = response.data;
		    $scope.equipements = [];
	    	$scope.capacities = [];

		    $scope.rooms.forEach(function(room) {
		    	var finded = false;

	    		$scope.capacities.forEach(function(capacity) {
	    			if (capacity.value === room.capacity) {
	    				finded = true;
	    			}
	    		})

	    		if (finded === false) {
	    			$scope.capacities.push({
		    			'value': room.capacity,
		    			'selected': false
		    		})
	    		}

		    	room.equipements.forEach(function(equipement) {
		    		var finded = false;

		    		$scope.equipements.forEach(function(searchEquipement) {
		    			if (searchEquipement.name === equipement.name) {
		    				finded = true;
		    			}
		    		})

		    		if (finded === false) {
		    			$scope.equipements.push({
			    			'name': equipement.name,
			    			'selected': false
			    		})
		    		}
		    	})
		    })
		}, function errorCallback(response) {
		    console.log(response);
		});
    }

	$scope.searchForRooms = function() {
		if (!$scope.start || !$scope.end) {
			return
		}

		var start = new Date($scope.startDate);
		start.setHours($scope.start.getHours());
		start.setMinutes($scope.start.getMinutes());
		start.setSeconds(0);
		
		var end = new Date($scope.startDate);
		end.setHours($scope.end.getHours());
		end.setMinutes($scope.end.getMinutes());
		end.setSeconds(0);

		$http({
		  method: 'POST',
		  url: '/rooms/search',
		  data: {
		  	start: start,
		  	end: end
		  }
		}).then(function successCallback(response) {
			if (response.data.err) {
				alert(response.data.err)
			} else {
				$scope.rooms = response.data;
				$scope.equipements = [];
	    		$scope.capacities = [];

	    		$rootScope.startDate = $scope.startDate;
			    $rootScope.start = $scope.start;
			    $rootScope.end = $scope.end;

			    $scope.rooms.forEach(function(room) {
			    	var finded = false;

		    		$scope.capacities.forEach(function(capacity) {
		    			if (capacity.value === room.capacity) {
		    				finded = true;
		    			}
		    		})

		    		if (finded === false) {
		    			$scope.capacities.push({
			    			'value': room.capacity,
			    			'selected': false
			    		})
		    		}

			    	room.equipements.forEach(function(equipement) {
			    		var finded = false;

			    		$scope.equipements.forEach(function(searchEquipement) {
			    			if (searchEquipement.name === equipement.name) {
			    				finded = true;
			    			}
			    		})

			    		if (finded === false) {
			    			$scope.equipements.push({
				    			'name': equipement.name,
				    			'selected': false
				    		})
			    		}
			    	})
			    })
			}
		}, function errorCallback(response) {
		    console.log(response);
		});
	}

	if ($rootScope.startDate && $rootScope.startDate !== null) {
    	$scope.startDate = $rootScope.startDate;
    	$scope.start = $rootScope.start;
    	$scope.end = $rootScope.end;
    } else {
    	$scope.startDate = new Date();
    	$scope.start = new Date();
    	$scope.end = new Date();
    }

    if ($rootScope.start && $rootScope.start !== null) {
    	$scope.searchForRooms();
    } else {
    	$scope.reset();
    }

	$scope.toggleFilter = function(filter) {
		filter.selected = !filter.selected;
		$scope.performSearch();
	}

	$scope.performSearch = function(room) {
		var isEquipementOk = true;

		if (room && $scope.equipements && $scope.equipements.length) {
			$scope.equipements.forEach(function(equipement) {
				if (equipement.selected === true) {
					var finded = false;

					room.equipements.forEach(function(searchingEquipement) {
						if (searchingEquipement.name === equipement.name) {
							finded = true;
						}
					})

					if (finded === false) {
						isEquipementOk = false;
					}
				}
			});
		}

		var isCapacitiesOk = true;

		if (room && $scope.capacities && $scope.capacities.length) {
			var finded = false;
			var selected = false;

			$scope.capacities.forEach(function(capacity) {
				if (capacity.selected === true) {
					selected = true;
					if (room.capacity === capacity.value) {
						finded = true;
					}
				}
			});

			if (selected === true && finded === false) {
				isCapacitiesOk = false;
			}
		}

		return isEquipementOk && isCapacitiesOk;
	};
});

app.controller('RoomCtrl', function($scope, $rootScope, $routeParams, $http) {
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

    if ($rootScope.startDate && $rootScope.startDate !== null) {
    	$rootScope.startDate = $rootScope.startDate;
    	$rootScope.start = $rootScope.start;
    	$rootScope.end = $rootScope.end;
    } else {
    	$scope.startDate = new Date();
    	$scope.start = null;
    	$scope.end = null;
    }

    console.log($rootScope);

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
		start.setSeconds(0);
		
		var end = new Date($scope.startDate);
		end.setHours($scope.end.getHours());
		end.setMinutes($scope.end.getMinutes());
		end.setSeconds(0);

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
	    		$scope.start = null;
				$scope.end = null;

				$rootScope.startDate = new Date();
		    	$rootScope.start = null;
		    	$rootScope.end = null;

				if ($scope.eventSources[0].length === 0) {
					$scope.eventSources[0] = [response.data.reservation]
				} else {
					$scope.eventSources[0].push(response.data.reservation)
				}
				alert('Room successfully booked.');
	    	}
		}, function errorCallback(response) {
			console.log(response);
		});
	}
});