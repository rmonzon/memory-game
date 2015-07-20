/**
 * Created by Raul Rivero on 6/8/2015.
 */

angular.module('services', []).factory('mainFactory', function($http, $q, $window) {
  var factory = { initFactory: false, connectionStr: "", url: "" };
  var apiDefer = null, apiUrl = null, proxy = null;
  factory.initApp = function () {
    // create a promise
    var deferred = $q.defer();
    var promise = deferred.promise;
    if (!factory.initFactory) {
      factory.initFactory = true;
      //factory.connectionStr = "http://192.168.1.127:5800/api/sql";
      //factory.url = "http://192.168.1.127:5800/api";
      factory.connectionStr = "http://intense-dawn-9976.herokuapp.com/api/sql";
      factory.url = "http://intense-dawn-9976.herokuapp.com/api";
      deferred.resolve(factory.initFactory);
    }
    else {
      deferred.resolve(factory.initFactory);
    }
    return promise;
  };

  factory.getAppVersion = function () {
    var request = {query: "SELECT info_appversion FROM info" };
    return $http.post(factory.connectionStr, request);
  };

  factory.addBadgeToPlayer = function (user) {
    var request = {query: "UPDATE public.user SET user_badges = '" + user.user_badges.join(',') + "' WHERE user_id = " + user.user_id };
    return $http.post(factory.connectionStr, request);
  };

  factory.setPlayerMaxScore = function (user, score) {
    var request = {query: "UPDATE public.user SET user_maxscore = " + score + " WHERE user_id = " + user.user_id };
    return $http.post(factory.connectionStr, request);
  };

  factory.getAllBadges = function () {
    var request = {query: "SELECT * FROM badge ORDER BY badge_id"};
    return $http.post(factory.connectionStr, request);
  };

  factory.getUsers = function () {
    var request = {query: "SELECT * FROM public.user ORDER BY public.user.user_id"};
    return $http.post(factory.connectionStr, request);
  };

  factory.registerUser = function (user) {
    var request = {query: "INSERT INTO public.user (user_playerid, user_pin, user_maxscore, user_realname, user_age) VALUES ('" + user.username + "', " + user.pin + ", 0, '" + user.name + "', " + user.age + ")"};
    return $http.post(factory.connectionStr, request);
  };

  factory.getAllUsersOrderedByScore = function () {
    var request = {query: "SELECT * FROM public.user ORDER BY public.user.user_maxscore DESC"};
    return $http.post(factory.connectionStr, request);
  };

  factory.getRankingByPlayerId = function (id) {
    var request = {query: "SELECT * FROM public.user WHERE user_id >= " + id + " - 5 AND user_id <= " + id + " + 15 ORDER BY public.user.user_maxscore DESC limit 20"};
    return $http.post(factory.connectionStr, request);
  };

  /*** Store user's info in session store, it'll be removed when log out ***/

  factory.setUserToStorage = function (user) {
    $window.sessionStorage && $window.sessionStorage.setItem('user', user);
    return this;
  };

  factory.getUserFromStorage = function () {
    return $window.sessionStorage && $window.sessionStorage.getItem('user');
  };

  /*** Store playerID in local storage if user checked that option  ***/

  factory.setUserToLocalStorage = function (id) {
    $window.localStorage && $window.localStorage.setItem('playerID', id);
    return this;
  };

  factory.getUserFromLocalStorage = function () {
    return $window.localStorage && $window.localStorage.getItem('playerID');
  };

  return factory;
});