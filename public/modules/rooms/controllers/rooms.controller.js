'use strict'

app.controller('RoomsCtrl', function($scope, $http) {
	$scope.equipements = [];
	$scope.capacities = [];
	
	$scope.startDate = new Date();
    $scope.start = new Date();
    $scope.end = new Date();

	$http({
	  method: 'GET',
	  url: '/rooms'
	}).then(function successCallback(response) {
	    $scope.rooms = response.data;

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

	$scope.toggleFilter = function(filter) {
		filter.selected = !filter.selected;
		$scope.performSearch();
	}

	$scope.performSearch = function() {
		$scope.search = [];

		$scope.equipements.forEach(function(equipement) {
			if (equipement.selected) {
				$scope.search.equipements = {
					'name': equipement.name
				}
			}
		})

		$scope.capacities.forEach(function(capacity) {
			if (capacity.selected) {
				$scope.search.capacity = capacity.value;
			}
		})
	};
});