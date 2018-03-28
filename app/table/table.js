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
        }])

    .controller('PlayerController', [ '$scope', '$http', '$routeParams', '$rootScope',
        function ($scope, $http, $routeParams, $rootScope) {
            $scope.players = [];
            $rootScope.all_players = [];
            $scope.selectedPlayers = [];
            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            };

            $http({
                method: 'GET',
                url: 'http://178.62.31.229/get_players',
                headers: {'Content-Type': 'application/json'}
            }).then(function successCallback(response) {
                // Store response data
                $scope.players = response.data;
            });
            $scope.AddPlayer = function(key) {
                $scope.selectedPlayers.push(key);
                console.log(key);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.RemovePlayer = function(key) {
                $scope.selectedPlayers.splice(key, 1);
                console.log(key);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.getPredictions = function() {
                $rootScope.predictions = [];
                angular.forEach($scope.selectedPlayers, function(value, key) {
                    $http({
                        method: 'GET',
                        url: 'http://178.62.31.229/preds/' + value.id,
                        headers: {'Content-Type': 'application/json'}
                    }).then(function successCallback(response) {
                        // Store response data
                        $rootScope.predictions.push(response.data);
                        console.log(response)
                    });
                });

            }}
            ]
    )

    .controller('PredictController', [ '$scope', '$http', '$routeParams', '$rootScope',
        function ($scope, $http, $routeParams, $rootScope) {
            $scope.predictions = [];
            var arrlength = $rootScope.all_players.length;
            $scope.full_arr = $rootScope.all_players[arrlength - 1];
            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            };
            $http({
                method: 'GET',
                url: 'http://178.62.31.229/midfielder/Salah',
                headers: {'Content-Type': 'application/json'}
            }).then(function successCallback(response) {
                // Store response data
                $scope.predictions = response.data;
            });
        } ]);