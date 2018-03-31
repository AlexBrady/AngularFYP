
'use strict';

angular.module('myApp.table', ['ngRoute', 'ui.bootstrap', 'ngTable'])

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

    .controller('PlayerController', [ '$scope', '$http', '$routeParams', '$rootScope', '$uibModal', 'NgTableParams',
        function ($scope, $http, $routeParams, $rootScope, $uibModal, NgTableParams) {
            // $scope.filteredPlayers = []
            //     ,$scope.currentPage = 1
            //     ,$scope.numPerPage = 10
            //     ,$scope.maxSize = 5;
            // $scope.settings = {
            //     currentPage: 0,
            //     offset: 0,
            //     pageLimit: 15,
            //     pageLimits: ['10', '50', '100']
            // };
            var self = this;
            $scope.positions = [{id: "", title: ""}, {id: 'Goalkeeper', title: 'Goalkeeper'}, {id: 'Defender', title: 'Defender'},
                {id: 'Midfielder', title: 'Midfielder'}, {id: 'Forward', title: 'Forward'}];
            $scope.team_names = [{id: "", title: ""}, {id: 'Arsenal', title: 'Arsenal'}, {id: 'Bournmouth', title: 'Bournmouth'},
                {id: 'Brighton', title: 'Brighton'}, {id: 'Burnley', title: 'Burnley'}, {id: 'Chelsea', title: 'Chelsea'},
                {id: 'Crystal Palace', title: 'Crystal Palace'}, {id: 'Everton', title: 'Everton'}, {id: 'Huddersfield', title: 'Huddersfield'}
                , {id: 'Leicester', title: 'Leicester'}, {id: 'Liverpool', title: 'Liverpool'}, {id: 'Man City', title: 'Man City'}
                , {id: 'Man United', title: 'Man United'}, {id: 'Newcastle', title: 'Newcastle'}
                , {id: 'Southampton', title: 'Southampton'}, {id: 'Stoke', title: 'Stoke'}
                , {id: 'Swansea', title: 'Swansea'}, {id: 'Spurs', title: 'Spurs'}
                , {id: 'Watford', title: 'Watford'}, {id: 'West Brom', title: 'West Brom'}
                , {id: 'West Ham', title: 'West Ham'}];
            $scope.players = [];
            $rootScope.all_players = [];
            $scope.selectedPlayers = [];
            $scope.animationsEnabled = true;
            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            };
            $scope.getPlayers = function () {
                $http({
                    method: 'GET',
                    url: 'http://178.62.31.229/get_player_details',
                    headers: {'Content-Type': 'application/json'}
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.players = response.data;
                    $scope.data = response.data;
                    $scope.setPageInfo();
                });
            };
            $scope.setPageInfo = function () {

                $scope.tableParams = new NgTableParams({}, {
                    dataset: $scope.data
                });
            };
            $scope.getPlayers();
            // this.tableParams = new NgTableParams({
            //     dataset: $scope.players
            // });



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
                            url: 'http://178.62.31.229/all_preds/' + value.player_id,
                            headers: {'Content-Type': 'application/json'}
                        }).then(function successCallback(response) {
                            // Store response data
                            $rootScope.predictions.push(response.data);
                            console.log(response)
                        });
                });
            };
            $scope.openInfo = function (size, e, player) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/playerModal.html',
                    controller: 'ModalInstanceController',
                    size: size,
                    resolve: {
                        Player: function () {
                            return player;
                        }
                    }
                });
                modalInstance.then(function () {
                    console.log('gowan son');
                });
                e.stopPropagation();
            };

    }])

    .controller('ModalInstanceController', [ '$scope', '$uibModalInstance','Player',
        function ($scope, $uibModalInstance, Player) {
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.playerInfo = Player;
        } ]);