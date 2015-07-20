/**
 * Created by Raul Rivero on 6/15/2015.
 */

angular.module('controllers').controller('HelpController', function($scope, $state, $timeout, $ionicPopup, $ionicLoading, $ionicSlideBoxDelegate, mainFactory) {

  $scope.navSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index, 500);
  };

  $scope.goToPage = function (name) {
    $state.go(name);
  };
});