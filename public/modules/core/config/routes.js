'use strict';

angular.module('app').config(['$routeProvider', function($routeProvider) {
	$routePrÎhovider.
		when("/", {
			templateUrl: "partials/index.html"
		}).
		otherwise({
			redirectTo: '/'
		});
	}]);