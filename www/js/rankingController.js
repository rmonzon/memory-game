/**
 * Created by Raul Rivero on 6/10/2015.
 */

angular.module('controllers').controller('RankingController', function($scope, $state, $timeout, $ionicPopup, mainFactory) {

  $scope.refreshing = false;
  $scope.listUsers = [];
  $scope.urlCupImgages = ['cup_gold.png', 'cup_silver.png', 'cup_bronze.png'];

  function init () {
    //AdMob.hideBanner();
    //window.analytics.trackView('RankingView');
    UpdateUserLoggedInfo();
    getAllUsersRanking();
  }

  function getAllUsersRanking () {
    $scope.listUsers = [];
    $scope.refreshing = true;
    mainFactory.getAllUsersOrderedByScore().success(function (data) {
      mainFactory.getAllBadges().success(function (badges) {
        for (var i = 0, len = data.length > 50 ? 50 : data.length; i < len; ++i) {
          $scope.listUsers.push(data[i]);
          $scope.listUsers[i].rankingPos = i + 1;
          $scope.listUsers[i].user_badges = $scope.listUsers[i].user_badges ? $scope.listUsers[i].user_badges.split(',') : [];
          $scope.listUsers[i].maxBadgeImg = getMaxBadgeByUserId($scope.listUsers[i], badges);
        }
        $scope.refreshing = false;
      });
    });
  }

  function getMaxBadgeByUserId (user, badges) {
    var maxBadge = -1;
    for (var i = 0; i < user.user_badges.length; ++i) {
      maxBadge = Math.max(maxBadge, user.user_badges[i]);
    }
    if (maxBadge !== -1) {
      return badges[maxBadge - 1].badge_img;
    }
    return 'photo.png';
  }

  $scope.findMe = function () {
    var listUsersAux = $scope.listUsers;
    $scope.listUsers = [];
    var copying = false, counter = 0;
    for (var i = 0; i < listUsersAux.length; ++i) {
      if (listUsersAux[i].user_id === $scope.userLogged.user_id || copying) {
        copying = true;
        $scope.listUsers.push(listUsersAux[i]);
        counter++;
        if (counter === 20) {
          break;
        }
      }
    }
  };

  $scope.refreshRanking = function () {
    getAllUsersRanking();
  };

  $scope.goToPage = function (name) {
    $state.go(name);
  };

  function UpdateUserLoggedInfo () {
    $scope.userLogged = JSON.parse(mainFactory.getUserFromStorage() || '{}');
  }

  init();
});