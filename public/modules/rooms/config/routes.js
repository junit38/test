'use strict';

angular.module('app').config(['$routeProvider', function($routeProvider) {
	$routePrÎhovider.
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