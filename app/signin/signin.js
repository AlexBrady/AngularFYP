'use strict';

angular.module('myApp.signin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('signin', {
            templateUrl: 'signin/signin.html',
            controller: 'SigninController'
        });
    }])

    .controller('SigninController', ['$scope', '$http', '$location', 'AuthService', '$httpParamSerializer', '$rootScope',
        function ($scope, $http, $location, AuthService, $httpParamSerializer, $rootScope) {
            $scope.user = {};
            $rootScope.userLoggedIn = false;
            $scope.signin = function () {
                $scope.error = false;
                $http({
                    method: 'POST',
                    url: 'http://127.0.0.1:5000/AuthenticateUser/',
                    data: $httpParamSerializer($scope.user),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function createSuccess(response) {
                    if (response.data.status === 200) {
                        $rootScope.userLoggedIn = true;
                        $location.path('/');
                        $scope.signInForm = {};
                    }
                    else {
                        $scope.error = true;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.signInForm = {};
                    }
                });
                    //
                    // }).catch( function errorCallback(response) {
                    //
                    // });
                
                // AuthService.login($scope.user.username, $scope.user.password)
                //     .then(function () {
                //         $location.path('/');
                //         $scope.disabled = false;
                //         $scope.signInForm = {};
                //     })
                //     .catch(function () {
                //         $scope.error = true;
                //         $scope.errorMessage = "Invalid username and/or password";
                //         $scope.disabled = false;
                //         $scope.signInForm = {};
                //     });
                // $http({
                //     method: 'POST',
                //     url: 'http://127.0.0.1:5000/SignIn',
                //     data: {username: $scope.username, password: $scope.password},
                //     headers: {'Content-Type': 'application/json'}
                // }).then(function createSuccess(response) {
                //     console.log(response.data)
                // });
            }
        }
        ]);