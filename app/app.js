'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.leagues',
  'myApp.table',
  'myApp.signin',
  'myApp.signup',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: 'table/table.html'
  }).when('/register', {
    templateUrl: 'signup/signup.html',
      controller: 'postCtrl'
  }).when('/signin', {
    templateUrl: 'signin/signin.html',
      controller: 'SigninController'
  }).when('/logout', {
          controller: 'logoutController'
  }).otherwise({redirectTo: '/leagues'});
}]);
