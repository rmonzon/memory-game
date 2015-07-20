/**
 * Created by Raul Rivero on 6/11/2015.
 */

angular.module('controllers').controller('LoginController', function($scope, $state, $timeout, $ionicPopup, $ionicLoading, mainFactory) {

  $scope.modelGUI = {};
  $scope.showHelp = false;
  $scope.emptyPlayerId = false;
  $scope.emptyPin = false;
  $scope.wrongCredentials = false;

  function init() {
    $scope.UpdateLoginInfo();
    if ($scope.modelGUI.rememberMe) {
      document.getElementById("pin").focus();
    }
    else {
      document.getElementById("playerid").focus();
    }
  }

  $scope.loginUser = function () {
    if (!$scope.modelGUI.playerId) {
      $scope.emptyPlayerId = true;
      return;
    }
    if (!$scope.modelGUI.pin) {
      $scope.emptyPin = true;
      return;
    }
    $scope.showLoadingMessage();
    mainFactory.getUsers()
      .success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].user_playerid == $scope.modelGUI.playerId && data[i].user_pin == $scope.modelGUI.pin) {
          data[i].user_badges = data[i].user_badges ? data[i].user_badges.split(',') : [];
          mainFactory.setUserToStorage(JSON.stringify(data[i]));
          if ($scope.modelGUI.rememberMe) {
            var obj = {"playerId": "" + $scope.modelGUI.playerId + ""};
            mainFactory.setUserToLocalStorage(JSON.stringify(obj));
          }
          else {
            window.localStorage.removeItem('playerID');
          }
          $scope.hideLoadingMessage();
          $state.go('options');
          return;
        }
      }
      $scope.hideLoadingMessage();
      $scope.wrongCredentials = true;
      $timeout(hideErrorMessage, 5000);
      console.log("Player ID and PIN are not correct!");
    })
      .error(function () {
        $scope.hideLoadingMessage();
        requestError("Something was wrong trying to contact our servers. Check your internet connection.");
      })
  };

  function requestError (msg) {
    var alertPopup = $ionicPopup.alert({
      title: 'Ohh noo!',
      template: msg
    });
    alertPopup.then(function (res) {

    });
  }

  function hideErrorMessage () {
    $scope.wrongCredentials = false;
  }

  $scope.showLoadingMessage = function() {
    $ionicLoading.show({
      template: 'Verifying credentials...'
    });
  };

  $scope.hideLoadingMessage = function(){
    $ionicLoading.hide();
  };

  $scope.showHelpText = function () {
    $scope.showHelp = !$scope.showHelp;
  };

  $scope.goToPage = function (name) {
    $state.go(name);
  };

  $scope.UpdateLoginInfo = function () {
    var obj = JSON.parse(mainFactory.getUserFromLocalStorage() || '{}');
    if (obj.playerId) {
      $scope.modelGUI.playerId = obj.playerId;
      /*
      var ini = obj.playerId.substr(0, 3);
      var end = obj.playerId.substr(3, obj.playerId.length);
      $scope.modelGUI.playerIdEncoded = ini + replaceAllByAsterisks(end);
      */
      $scope.modelGUI.rememberMe = true;
    }
  };

  function replaceAllByAsterisks (str) {
    var res = '';
    for (var i = 0; i < str.length; ++i) {
      res += '*';
    }
    return res;
  }

  init();
});