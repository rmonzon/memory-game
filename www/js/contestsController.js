/**
 * Created by Raul Rivero on 6/23/2015.
 */

angular.module('controllers').controller('ContestsController', function($scope, $state, $interval, $timeout, $ionicPopup, mainFactory) {

  $scope.contest_level = ['contest-level1.png', 'contest-level2.png', 'contest-level3.png'];
  $scope.contests = [
    { contest_id: 1, contest_name: 'Contest_untitled1', total_players: 5, level: 2, time_remaining_secs: 120 },
    { contest_id: 2, contest_name: 'Contest_untitled2', total_players: 2, level: 1, time_remaining_secs: 80 },
    { contest_id: 3, contest_name: 'Contest_untitled3', total_players: 7, level: 3, time_remaining_secs: 240 }
  ];

  function init () {

  }

  function getIndexOfContestsArray (id) {
    for (var i = 0; i < $scope.contests.length; ++i) {
      if ($scope.contests[i].contest_id == id) {
        return i;
      }
    }
    return -1;
  }

  $scope.joinContest = function (index) {
    index = getIndexOfContestsArray(index);
    $scope.contests[index].joined = true;
  };

  $scope.goToPage = function (name) {
    $state.go(name);
  };

  init();
});