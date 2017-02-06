'use strict';

var app = angular.module('app', [
		'ngRoute',
		'ngCookies',
		'ngResource',
		'ui.calendar',
		'ngMaterial',
		'mdPickers'
	]);

app.run(function($rootScope, $location) {
	$rootScope.$location = $location;
})