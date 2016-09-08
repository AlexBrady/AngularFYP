/**
 * Created by mike on 2016-06-14.
 */

'use strict';

angular.module('myApp.table', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/table', {
            templateUrl: 'table/table.html',
            controller: 'TableController'
        });
    }])

    .controller('TableController', [ '$scope', '$http', '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.leagueCaption = '';
            $scope.standings = [];

            var leagueId = $routeParams.leagueId;
            console.log(leagueId);

            $http({
                method : "GET",
                url : "http://api.football-data.org/v1/soccerseasons/" + leagueId + "/leagueTable",
                headers: {
                    'X-Auth-Token': '50f1e7e15f1941e98e3e56c2db1f8163'
                }
            }).then(function mySuccess(response) {
                $scope.leagueCaption = response.data.leagueCaption;
                $scope.standings = response.data.standing;
            }, function myError(response) {
                $scope.errorMsg = response.statusText;
            });
    }])

    .controller('FixtureController', [ '$scope', '$http', '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.fixtures = [];

            var leagueId = $routeParams.leagueId;
            console.log(leagueId + " from fixtures");

            $http({
                method : "GET",
                url : "http://api.football-data.org/v1/competitions/" + leagueId + "/fixtures?matchday=1",
                headers: {
                    'X-Auth-Token': '50f1e7e15f1941e98e3e56c2db1f8163'
                }
            }).then(function mySuccess(response) {
                $scope.fixtures = response.data.fixtures;
            }, function myError(response) {
                $scope.errorMsg = response.statusText;
            });
        }]);