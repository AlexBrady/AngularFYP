
'use strict';

angular.module('myApp.table', ['ngRoute', 'ui.bootstrap', 'ngTable'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/table', {
            templateUrl: 'table/table.html',
            controller: 'TableController',
            access: {restricted: true}
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

    .controller('PlayerController', [ '$scope', '$http', '$routeParams', '$rootScope', '$uibModal',
        'NgTableParams', 'AuthService', '$httpParamSerializer',
        function ($scope, $http, $routeParams, $rootScope, $uibModal, NgTableParams, AuthService, $httpParamSerializer) {
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
            $scope.init = function () {
                
            };
            $scope.positions = [{id: "", title: ""}, {id: 'Goalkeeper', title: 'Goalkeeper'}, {
                id: 'Defender',
                title: 'Defender'
            },
                {id: 'Midfielder', title: 'Midfielder'}, {id: 'Forward', title: 'Forward'}];
            $scope.team_names = [{id: "", title: ""}, {id: 'Arsenal', title: 'Arsenal'}, {
                id: 'Bournmouth',
                title: 'Bournmouth'
            },
                {id: 'Brighton', title: 'Brighton'}, {id: 'Burnley', title: 'Burnley'}, {
                    id: 'Chelsea',
                    title: 'Chelsea'
                },
                {id: 'Crystal Palace', title: 'Crystal Palace'}, {id: 'Everton', title: 'Everton'}, {
                    id: 'Huddersfield',
                    title: 'Huddersfield'
                }
                , {id: 'Leicester City', title: 'Leicester City'}, {id: 'Liverpool', title: 'Liverpool'}, {
                    id: 'Manchester City',
                    title: 'Manchester City'
                }
                , {id: 'Manchester United', title: 'Manchester United'}, {id: 'Newcastle United', title: 'Newcastle United'}
                , {id: 'Southampton', title: 'Southampton'}, {id: 'Stoke City', title: 'Stoke City'}
                , {id: 'Swansea', title: 'Swansea'}, {id: 'Tottenham Hotspur', title: 'Tottenham Hotspur'}
                , {id: 'Watford', title: 'Watford'}, {id: 'West Bromwich Albion', title: 'West Bromwich Albion'}
                , {id: 'West Ham United', title: 'West Ham United'}];
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


            $scope.AddPlayer = function (key) {
                $scope.selectedPlayers.push(key);
                console.log(key);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.RemovePlayer = function (key) {
                var index = $scope.selectedPlayers.indexOf(key);
                $scope.selectedPlayers.splice(index, 1);
                console.log(key);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.clearTeam = function () {
                $scope.selectedPlayers = [];
            };
            $scope.getPredictions = function () {
                $rootScope.predictions = [];
                angular.forEach($scope.selectedPlayers, function (value, key) {
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
            var user = null;
            $scope.getUserStatus = function () {
                return $http.get('http://127.0.0.1:5000/status/')
                // handle success
                    .success(function (data) {
                        if(data.status === true){
                            console.log(data);
                            $scope.user = true;
                            user = true;
                        } else {
                            console.log(data);
                            user = false;
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });
            }
            $scope.saveTeam = function () {
                $scope.current_user = $rootScope.user_id;
                angular.forEach($scope.selectedPlayers, function (value, key) {
                    $http({
                        method: 'POST',
                        url: 'http://127.0.0.1:5000/saveTeam/',
                        data: $httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function createSuccess(response) {
                        console.log(value);
                        console.log(response.data);
                    }, function errorCallback(response) {
                        console.log($httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}))
                        console.log(value);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                });
            }
            $scope.loadTeam = function () {
                $scope.current_user = $rootScope.user_id;
                $http({
                        method: 'POST',
                        url: 'http://127.0.0.1:5000/loadTeam/',
                        data: $httpParamSerializer({tid:1, uid:$scope.current_user}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function createSuccess(response) {
                        console.log(response.data);
                        
                        angular.forEach(response.data, function (value, key) {
                             $http({
                                    method: 'GET',
                                    url: 'http://127.0.0.1:5000/get_single_player/' + value.pid,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).then(function createSuccess(response) {
                                $scope.selectedPlayers.push(response.data)
                            }, function errorCallback(response) {
                                console.log($httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}))
                                console.log(value);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    }); 
                        })

                    }, function errorCallback(response) {
                        console.log($httpParamSerializer({tid:1, uid:$scope.current_user}))
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }


        }])
                .controller('ModalInstanceController', ['$scope', '$uibModalInstance', 'Player',
                    function ($scope, $uibModalInstance, Player) {
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.playerInfo = Player;
                    }]);
