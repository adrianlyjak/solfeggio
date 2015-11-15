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

solfeggio.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'templates/main.html',
    controller: 'MainController'
  });
});

solfeggio.factory('AudioService', require('./services/AudioService'))

solfeggio.factory('SolfeggioScaleService', require('./services/SolfeggioScaleService'));



solfeggio.controller('MainController', function($scope, AudioService, SolfeggioScaleService) {
  $scope.notes = SolfeggioScaleService.notes().map((n) => {
    return Object.assign(n, { config: AudioService.configHertz(n.hertz) })
  });
  $scope.toggle = function(note) {
    note.config.on = !note.config.on
    $scope.updateAudio(note)
    
  }
  $scope.updateAudio = function(note) {
    AudioService.update(note.hertz, note.config)
  }

});



solfeggio.controller('SolfeggioToneController', function($scope, AudioService) {

});