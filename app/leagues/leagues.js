'use strict';

angular.module('myApp.leagues', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leagues', {
    templateUrl: 'leagues/leagues.html',
    controller: 'LeaguesController'
  });
}])

.controller('LeaguesController', [ '$scope', '$http', '$location',
  function($scope, $http, $location) {
    $scope.leagues = [];

    $http({
      method : "GET",
      url : "http://api.football-data.org/v1/soccerseasons/?season=2016",
      headers: {
        'X-Auth-Token': '50f1e7e15f1941e98e3e56c2db1f8163'
      }
    }).then(function mySuccess(response) {
      $scope.leagues = response.data;
    }, function myError(response) {
      $scope.errorMsg = response.statusText;
    });

    $scope.showTable = function(league) {
      $location.url('table'+'?leagueId='+league.id);
    };

}]);