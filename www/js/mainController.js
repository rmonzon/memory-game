/**
 * Created by Raul Rivero on 6/8/2015.
 */

angular.module('controllers', []).controller('AppCtrl', function($scope, $state, $ionicPopup, mainFactory, VERSION) {

  $scope.modelGUI = {};
  $scope.user_badges_img = [];
  $scope.updateRequired = false;

  function init () {
    //AdMob.hideBanner();
    checkForUpdates();
    $scope.UpdateUserLoggedInfo();
    mainFactory.getAllBadges().success(function (data) {
      if ($scope.userLogged.user_badges) {
        for (var i = 0; i < 8; ++i) {
          //$scope.user_badges_img.push('img/' + data[i].badge_img);
          if (i == $scope.userLogged.user_badges[i] - 1) {
            $scope.user_badges_img.push('img/' + data[i].badge_img);
          }
          else {
            $scope.user_badges_img.push('img/locked-badge.png');
          }
        }
      }
    });
  }

  function checkForUpdates () {
    mainFactory.getAppVersion().success(function (data) {
      $scope.updateRequired = data[0].info_appversion != VERSION.version;
    });
  }

  $scope.logout = function() {
    window.sessionStorage.removeItem('user');
    $state.go('home');
  };

  $scope.goToPage = function (name) {
    $state.go(name);
  };

  $scope.UpdateUserLoggedInfo = function () {
    $scope.userLogged = JSON.parse(mainFactory.getUserFromStorage() || '{}');
  };

  init();
});