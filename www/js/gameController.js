/**
 * Created by Raul Rivero on 6/8/2015.
 */

angular.module('controllers').controller('GameController', function($scope, $rootScope, $state, $timeout, $ionicPopup, mainFactory) {

  function init () {
    $scope.rows = [];
    $scope.cols = [];
    $scope.boardSize = { rows: 0, cols: 0 };
    $scope.gamesPlayed = 0;
    $scope.numCorrectCells = 0;
    $scope.numColorSelecCells = 0;
    $scope.level = 0;
    $scope.badge = "";
    $scope.difficulty = {};
    $scope.widthClass = "";
    $scope.correctCells = [];
    $scope.visitedCells = [];
    $scope.colorCells = [];
    $scope.colorSelecCells = [];
    $scope.gameStarted = false;
    $scope.gameReady = false;
    $scope.leaveGame = false;
    $scope.score = 0;
    $scope.points = 0;
    $scope.badges = [];
    $scope.multiColor = false;
    $scope.colors = ['button-stable', 'button-balanced', 'button-assertive'];
    $scope.difficultyColors = ['easy-level-memory', 'medium-level-memory', 'hard-level-memory'];
    //$scope.my_media = {};

    setGameParams();
    //loadAudioFiles();
    $scope.UpdateUserLoggedInfo();
    getAllBadges();
    getHighestBadgeImg();
    $timeout(startGame, 500);
    //window.analytics.trackEvent('New game', 'Start new game');
    //showAdvertisement();
  }

  function showAdvertisement () {
    AdMob.createBanner({
      adId: 'ca-app-pub-9409507329131068/9596859832',
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
      //isTesting: true
    });
  }

  function getAllBadges () {
    mainFactory.getAllBadges().success(function (data) {
      $scope.badges = data;
    });
  }

  function getHighestBadgeImg () {
    mainFactory.getAllBadges().success(function (data) {
      var maxBadge = -1;
      for (var i = 0; i < $scope.userLogged.user_badges.length; ++i) {
        maxBadge = Math.max(maxBadge, $scope.userLogged.user_badges[i]);
      }
      if (maxBadge !== -1) {
        $scope.userLogged.highestBadgeImg = data[maxBadge - 1].badge_img;
      }
      else {
        $scope.userLogged.highestBadgeImg = 'photo.png';
      }
    });
  }

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (!$scope.leaveGame) {
      event.preventDefault();
      $scope.exitGame();
    }
  });

  function loadAudioFiles () {
    var audioElement = document.getElementById('successSound');
    var url = audioElement.getAttribute('src');
    $scope.my_media = new Media('/android_asset/www/' + url, function () { console.log("Audio Success"); }, function (err) { console.log("Audio Error: " + err); });
  }

  function selectCellColor (index) {
    var myPopup = $ionicPopup.show({
      //template: '<input type="password" ng-model="data.wifi">',
      title: 'Cell color selection',
      subTitle: 'Select the color you think this cell was painted',
      scope: $scope,
      buttons: [
        {
          text: 'Green',
          type: 'button-balanced',
          onTap: function(e) {
            return 'green';
          }
        },
        /*
        {
          text: 'Brown',
          type: 'button-royal',
          onTap: function(e) {
            return 'brown';
          }
        },
        */
        {
          text: 'Yellow',
          type: 'button-energized',
          onTap: function(e) {
            return 'yellow';
          }
        }
      ]
    });
    myPopup.then(function(res) {
      if ($scope.colorCells[index].color == res) {
        $scope.visitedCells[index] = true;
        $scope.numCorrectCells--;
        $scope.score++;
        $scope.colorCells[index].class = res == 'green' ? 'button-balanced' : 'button-energized';
        if ($scope.numCorrectCells === 0) {
          wonGame();
        }
      }
      else {
        $scope.colorCells[index].class = 'button-assertive';
        openDialogGameOver();
      }
    });
  }

  function setSelectionColorCells () {
    var pos = -1, num = $scope.numColorSelecCells;
    while (num > 0) {
      pos = Math.floor(Math.random() * ($scope.boardSize.rows * $scope.boardSize.cols));
      if ($scope.correctCells[pos]) {
        $scope.colorSelecCells[pos] = true;
        num--;
      }
    }
  }

  $scope.onClickCell = function (cellNum) {
    if ($scope.gameReady) {
      // Play audio on Android devices
      //$scope.my_media.play();
      // Play audio on web browsers
      //audioElement.play();
      if (!$scope.visitedCells[cellNum]) {
        if ($scope.correctCells[cellNum]) {
          if ($scope.colorSelecCells[cellNum]) {
            selectCellColor(cellNum);
          }
          else {
            $scope.visitedCells[cellNum] = true;
            $scope.numCorrectCells--;
            $scope.score++;
            $scope.colorCells[cellNum].class = $scope.colorCells[cellNum].color == 'green' ? 'button-balanced' : 'button-energized';
            //$scope.colorCells[cellNum].class = 'button-balanced';
            if ($scope.numCorrectCells === 0) {
              wonGame();
            }
          }
        }
        else {
          $scope.colorCells[cellNum].class = 'button-assertive';
          openDialogGameOver();
        }
      }
    }
  };

  function wonGame () {
    var nextLevel = getLevel();
    var bIndex = getIndexBadgeEarned(nextLevel);
    if (bIndex === -1) {
      openDialogGameWon();
    }
    else {
      $scope.userLogged.user_badges.push("" + bIndex + "");
      mainFactory.setUserToStorage(JSON.stringify($scope.userLogged));
      mainFactory.addBadgeToPlayer($scope.userLogged).success(function () {
      });
      openDialogNewBadge($scope.badges[bIndex - 1].badge_name);
    }
  }

  /**
   * Returns -1 if the user already has a badge, otherwise returns its index
   * @param level
   * @returns {number}
   */
  function getIndexBadgeEarned (level) {
    var index;
    switch (level) {
      case 2:
        index = $scope.userLogged.user_badges.indexOf('1');
        return index === -1 ? 1 : -1;
      case 3:
        index = $scope.userLogged.user_badges.indexOf('2');
        return index === -1 ? 2 : -1;
      case 4:
        index = $scope.userLogged.user_badges.indexOf('3');
        return index === -1 ? 3 : -1;
      case 5:
        index = $scope.userLogged.user_badges.indexOf('4');
        return index === -1 ? 4 : -1;
      case 7:
        index = $scope.userLogged.user_badges.indexOf('5');
        return index === -1 ? 5 : -1;
      case 8:
        index = $scope.userLogged.user_badges.indexOf('6');
        return index === -1 ? 6 : -1;
      case 9:
        index = $scope.userLogged.user_badges.indexOf('7');
        return index === -1 ? 7 : -1;
      case 10:
        index = $scope.userLogged.user_badges.indexOf('8');
        return index === -1 ? 8 : -1;
      default :
        return -1;
    }
  }

  function setGameParams () {
    if ($scope.gamesPlayed === 0) {
      $scope.level = 1;
      $scope.difficulty = { id: 0, name: "Easy"};
      $scope.numCorrectCells = 3;
      $scope.numColorSelecCells = 0;
      $scope.widthClass = "col-50";
      $scope.boardSize.rows = 2;
      $scope.boardSize.cols = 2;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed === 1) {
      $scope.level = 1;
      $scope.difficulty = { id: 0, name: "Easy"};
      $scope.numCorrectCells = 4;
      $scope.numColorSelecCells = 0;
      $scope.widthClass = "col-33";
      $scope.boardSize.rows = 3;
      $scope.boardSize.cols = 3;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 2 && $scope.gamesPlayed < 4) {
      $scope.level = 2;
      $scope.difficulty = { id: 0, name: "Easy"};
      $scope.numCorrectCells = 5;
      $scope.numColorSelecCells = 0;
      $scope.widthClass = "col-33";
      $scope.boardSize.rows = 3;
      $scope.boardSize.cols = 3;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 4 && $scope.gamesPlayed < 7) {
      $scope.level = 3;
      $scope.difficulty = { id: 0, name: "Easy"};
      $scope.numCorrectCells = 6;
      $scope.numColorSelecCells = 2;
      $scope.widthClass = "col-33";
      $scope.boardSize.rows = 4;
      $scope.boardSize.cols = 3;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 7 && $scope.gamesPlayed < 9) {
      $scope.level = 3;
      $scope.difficulty = { id: 0, name: "Easy"};
      $scope.numCorrectCells = 7;
      $scope.widthClass = "col-33";
      $scope.boardSize.rows = 4;
      $scope.boardSize.cols = 3;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 9 && $scope.gamesPlayed < 12) {
      $scope.level = 4;
      $scope.difficulty = { id: 1, name: "Medium"};
      $scope.numCorrectCells = 8;
      $scope.numColorSelecCells = 3;
      $scope.widthClass = "col-25";
      $scope.boardSize.rows = 4;
      $scope.boardSize.cols = 4;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 12 && $scope.gamesPlayed < 14) {
      $scope.level = 5;
      $scope.difficulty = { id: 1, name: "Medium"};
      $scope.numCorrectCells = 9;
      $scope.numColorSelecCells = 4;
      $scope.widthClass = "col-25";
      $scope.boardSize.rows = 4;
      $scope.boardSize.cols = 4;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 14 && $scope.gamesPlayed < 18) {
      $scope.level = 5;
      $scope.difficulty = { id: 1, name: "Medium"};
      $scope.numCorrectCells = 10;
      $scope.numColorSelecCells = 4;
      $scope.widthClass = "col-25";
      $scope.boardSize.rows = 5;
      $scope.boardSize.cols = 4;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 18 && $scope.gamesPlayed < 23) {
      $scope.level = 6;
      $scope.difficulty = { id: 1, name: "Medium"};
      $scope.numCorrectCells = 12;
      $scope.numColorSelecCells = 5;
      $scope.widthClass = "col-25";
      $scope.boardSize.rows = 5;
      $scope.boardSize.cols = 4;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 23 && $scope.gamesPlayed < 26) {
      $scope.level = 7;
      $scope.difficulty = { id: 2, name: "Hard"};
      $scope.numCorrectCells = 14;
      $scope.numColorSelecCells = 6;
      $scope.widthClass = "col-20";
      $scope.boardSize.rows = 5;
      $scope.boardSize.cols = 5;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 26 && $scope.gamesPlayed < 30) {
      $scope.level = 7;
      $scope.difficulty = { id: 2, name: "Hard"};
      $scope.numCorrectCells = 15;
      $scope.numColorSelecCells = 6;
      $scope.widthClass = "col-20";
      $scope.boardSize.rows = 5;
      $scope.boardSize.cols = 5;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 30 && $scope.gamesPlayed < 35) {
      $scope.level = 8;
      $scope.difficulty = { id: 2, name: "Hard"};
      $scope.numCorrectCells = 16;
      $scope.numColorSelecCells = 7;
      $scope.widthClass = "col-20";
      $scope.boardSize.rows = 5;
      $scope.boardSize.cols = 5;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 35 && $scope.gamesPlayed < 40) {
      $scope.level = 9;
      $scope.difficulty = { id: 2, name: "Hard"};
      $scope.numCorrectCells = 18;
      $scope.numColorSelecCells = 8;
      $scope.widthClass = "col-20";
      $scope.boardSize.rows = 6;
      $scope.boardSize.cols = 5;
      rebuildGameBoard();
      return;
    }
    if ($scope.gamesPlayed >= 40) {
      $scope.level = 10;
      $scope.difficulty = { id: 2, name: "Hard"};
      $scope.numCorrectCells = 19;
      $scope.numColorSelecCells = 10;
      $scope.widthClass = "col-20";
      $scope.boardSize.rows = 6;
      $scope.boardSize.cols = 5;
      rebuildGameBoard();
    }
  }

  function getLevel () {
    if ($scope.gamesPlayed >= 0 && $scope.gamesPlayed < 2) {
      return 1;
    }
    if ($scope.gamesPlayed >= 2 && $scope.gamesPlayed < 4) {
      return 2;
    }
    if ($scope.gamesPlayed >= 4 && $scope.gamesPlayed < 9) {
      return 3;
    }
    if ($scope.gamesPlayed >= 9 && $scope.gamesPlayed < 12) {
      return 4;
    }
    if ($scope.gamesPlayed >= 12 && $scope.gamesPlayed < 18) {
      return 5;
    }
    if ($scope.gamesPlayed >= 18 && $scope.gamesPlayed < 23) {
      return 6;
    }
    if ($scope.gamesPlayed >= 23 && $scope.gamesPlayed < 30) {
      return 7;
    }
    if ($scope.gamesPlayed >= 30 && $scope.gamesPlayed < 35) {
      return 8;
    }
    if ($scope.gamesPlayed >= 35 && $scope.gamesPlayed < 40) {
      return 9;
    }
    if ($scope.gamesPlayed >= 40) {
      return 10;
    }
  }

  function rebuildGameBoard () {
    $scope.rows = [];
    $scope.cols = [];
    for (var i = 0; i < $scope.boardSize.rows; ++i) {
      $scope.rows.push(i);
    }
    for (i = 0; i < $scope.boardSize.cols; ++i) {
      $scope.cols.push(i);
    }
  }

  function startGame () {
    $scope.gamesPlayed++;
    $scope.gameReady = false;
    $scope.gameStarted = true;
    $timeout(function () { generateGame(); }, 500);
    $timeout(function () { hideAnswers(); }, 1500);
    $timeout(function () { $scope.gameReady = true; }, 1500);
  }

  function generateGame () {
    $scope.correctCells = [];
    $scope.colorSelecCells = [];
    $scope.visitedCells = [];
    $scope.colorCells = [];
    var numColCells = $scope.numColorSelecCells;
    for (var i = 0; i < $scope.boardSize.rows * $scope.boardSize.cols; ++i) {
      $scope.correctCells.push(false);
      $scope.visitedCells.push(false);
      $scope.colorSelecCells.push(false);
      $scope.colorCells.push({ color: null, class: 'button-stable' });
    }
    var j = 0;
    while (j < $scope.numCorrectCells) {
      var num = Math.floor(Math.random() * ($scope.boardSize.rows * $scope.boardSize.cols));
      if (!$scope.correctCells[num]) {
        $scope.correctCells[num] = true;
        var x = 1;
        if (numColCells > 0) {
          x = 2;
          numColCells--;
        }
        $scope.colorCells[num].color = x === 1 ? 'green' : 'yellow';
        $scope.colorCells[num].class = x === 1 ? 'button-balanced' : 'button-energized';
        ++j;
      }
    }
    setSelectionColorCells();
  }

  function hideAnswers () {
    for (var i = 0; i < $scope.boardSize.rows * $scope.boardSize.cols; ++i) {
      if ($scope.colorCells.length > i) {
        $scope.colorCells[i].class = 'button-stable';
      }
      else {
        break;
      }
    }
  }

  function openDialogNewBadge (badge) {
    var alertPopup = $ionicPopup.alert({
      title: 'New badge!',
      template: 'Congrats! You\'ve earned the <b>' + badge + '</b> badge.'
    });
    alertPopup.then(function (res) {
      getHighestBadgeImg();
      openDialogGameWon();
    });
  }

  function openDialogGameWon () {
    var levelAux = getLevel();
    var alertPopup = $ionicPopup.alert({
      title: levelAux !== $scope.level ? 'Level completed!' : 'Congratulations!',
      template: levelAux !== $scope.level ? 'You\'ve successfully reached level <b>' + levelAux + '</b>.' : 'Keep going to reach higher levels.'
    });
    alertPopup.then(function (res) {
      if (res) {
        setGameParams();
        hideAnswers();
        startGame();
      }
      else {
        $state.go('options');
      }
    });
  }

  function openDialogGameOver () {
    var max = $scope.userLogged.user_maxscore;
    var alertPopup = $ionicPopup.alert({
      title: 'Game over!',
      template: max < $scope.score ? 'You\'ve increased your overall score to <b>' + $scope.score + '</b> points!' : 'You didn\'t increase your overall score in this game.'
    });
    alertPopup.then(function (res) {
      if (max < $scope.score) {
        mainFactory.setPlayerMaxScore($scope.userLogged, $scope.score).success(function () {
          $scope.userLogged.user_maxscore = $scope.score;
          mainFactory.setUserToStorage(JSON.stringify($scope.userLogged));
        });
      }
      //AdMob.hideBanner();
      $scope.leaveGame = true;
      $state.go('options');
    });
  }

  $scope.exitGame = function () {
    var max = $scope.userLogged.user_maxscore;
    var alertPopup = $ionicPopup.confirm({
      title: 'Warning!',
      template: 'You are about to leave this game. Do you confirm this action?'
    });
    alertPopup.then(function (res) {
      if (res) {
        $scope.leaveGame = true;
        if (max < $scope.score) {
          mainFactory.setPlayerMaxScore($scope.userLogged, $scope.score).success(function () {
            $scope.userLogged.user_maxscore = $scope.score;
            mainFactory.setUserToStorage(JSON.stringify($scope.userLogged));
          });
        }
        //AdMob.hideBanner();
        $state.go('options');
      }
    });
  };

  $scope.UpdateUserLoggedInfo = function () {
    $scope.userLogged = JSON.parse(mainFactory.getUserFromStorage() || '{}');
  };

  init();
});