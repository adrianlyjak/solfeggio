var solfeggio = angular.module('solfeggio', ['ionic'])

solfeggio.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
      templateUrl: './templates/main.html',
      controller: 'mainController'
    })
    .state('tone', {
      url: '/tone/:hz',
      templateUrl: './templates/tone.html',
      controller: 'toneController'
    })

});

require('./services/AudioService')(solfeggio);
require('./services/ToneService')(solfeggio);
require('./controllers/mainController')(solfeggio);
require('./controllers/toneController')(solfeggio);
require('./directives/toneKey')(solfeggio);



