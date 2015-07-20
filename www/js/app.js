// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'controllers', 'services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
      // Now safe to use device APIs
      window.analytics.startTrackerWithId('UA-64157630-1');

      var admobid = {};
      if( /(android)/i.test(navigator.userAgent) )
      {
        admobid = { // for Android
          banner: 'ca-app-pub-9409507329131068/9596859832'//, // or DFP format "/6253334/dfp_example_ad"
          //interstitial: 'ca-app-pub-xxx/yyy'
        };
      }
      else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent))
      {
        admobid = { // for iOS
          banner: 'ca-app-pub-9409507329131068/9596859832'//, // or DFP format "/6253334/dfp_example_ad"
          //interstitial: 'ca-app-pub-xxx/kkk'
        };
      }
    }
  });
})

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
        url: "/home",
        public: true,
        templateUrl: "templates/home.html",
        controller: 'LoginController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('game', {
        url: "/game",
        public: true,
        templateUrl: "templates/game.html",
        controller: 'GameController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('options', {
        url: "/options",
        public: true,
        templateUrl: "templates/options.html",
        controller: 'AppCtrl',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('help', {
        url: "/help",
        public: true,
        templateUrl: "templates/help.html",
        controller: 'HelpController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('badges', {
        url: "/badges",
        public: true,
        templateUrl: "templates/badges.html",
        controller: 'AppCtrl',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('ranking', {
        url: "/ranking",
        public: true,
        templateUrl: "templates/ranking.html",
        controller: 'RankingController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('contests', {
        url: "/contests",
        public: true,
        templateUrl: "templates/contests.html",
        controller: 'ContestsController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('create_contest', {
        url: "/create_contest",
        public: true,
        templateUrl: "templates/create_contest.html",
        controller: 'CreateContestController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      })
      .state('register', {
        url: "/register",
        public: true,
        templateUrl: "templates/register.html",
        controller: 'RegisterController',
        resolve: {
          factoryInitialized: function (mainFactory) {
            return mainFactory.initApp();
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  });
