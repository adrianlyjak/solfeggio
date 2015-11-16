var solfeggio = angular.module('solfeggio', ['ionic'])

solfeggio.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

solfeggio.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.useXDomain = true;﻿

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('tones', {
      url: '/',
      templateUrl: 'templates/main.html',
      controller: 'mainController'
    })
    .state('tone', {
      url: '/tone/:hz',
      templateUrl: 'templates/tone.html',
      controller: 'toneController'
    })

});

require('./services/AudioService')(solfeggio);
require('./services/ToneService')(solfeggio);
require('./controllers/mainController')(solfeggio);
require('./controllers/toneController')(solfeggio);
require('./directives/toneKey')(solfeggio);



