/**
 * Created by Raul Rivero on 6/15/2015.
 */

angular.module('controllers').controller('RegisterController', function($scope, $state, $timeout, $ionicPopup, $ionicLoading, mainFactory) {

  $scope.modelGUI = {};
  $scope.emptyPlayerId = false;
  $scope.emptyPin = false;
  $scope.emptyName = false;
  $scope.wrongPin = false;

  AdMob.hideBanner();

  $scope.registerUser = function () {
    if (!$scope.modelGUI.name) {
      $scope.emptyName = true;
      return;
    }
    if (!$scope.modelGUI.username) {
      $scope.emptyPlayerId = true;
      return;
    }
    if (!$scope.modelGUI.pin) {
      $scope.emptyPin = true;
      return;
    }
    if ($scope.modelGUI.pin.toString().length < 4 || $scope.modelGUI.pin.toString().length > 8) {
      $scope.wrongPin = true;
      $timeout(hideErrorMessage, 5000);
      return;
    }
    $scope.modelGUI.age = $scope.modelGUI.age === undefined ? null : $scope.modelGUI.age;
    $scope.showLoadingMessage();
    mainFactory.getUsers().success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].user_playerid === $scope.modelGUI.username) {
          $scope.modelGUI.username = "";
          $scope.hideLoadingMessage();
          showMessageError();
          return;
        }
      }
      mainFactory.registerUser($scope.modelGUI).success(function () {
        //window.analytics.trackEvent('New user', 'Register User');
        $scope.hideLoadingMessage();
        showMessageSuccess();
      });
    })
      .error(function () {
        $scope.hideLoadingMessage();
        requestError("There is no internet connection! We're unable to contact our servers.");
      });
  };

  function requestError (msg) {
    var alertPopup = $ionicPopup.alert({
      title: 'Request error!',
      template: msg
    });
    alertPopup.then(function (res) {

    });
  }

  function hideErrorMessage () {
    $scope.wrongPin = false;
  }

  $scope.showLoadingMessage = function() {
    $ionicLoading.show({
      template: 'Registering new player...'
    });
  };

  $scope.hideLoadingMessage = function(){
    $ionicLoading.hide();
  };

  function showMessageError () {
    var alertPopup = $ionicPopup.confirm({
      title: 'Error',
      template: "Player ID <b>" + $scope.modelGUI.username + "</b> is taken by another user. Please select a different one."
    });
    alertPopup.then(function (res) {
    });
  }

  function showMessageSuccess () {
    var alertPopup = $ionicPopup.alert({
      title: 'Confirmation',
      template: "New player <b>" + $scope.modelGUI.username + "</b> has been created succesfully!"
    });
    alertPopup.then(function (res) {
      $state.go('home');
    });
  }
});