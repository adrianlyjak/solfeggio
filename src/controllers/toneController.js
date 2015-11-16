function toneController($scope, $stateParams, $state, AudioService, ToneService) {
  return Object.assign($scope, {
    initTone(hz) {
      $scope.tone = Object.assign(ToneService.toneAt(hz), { config: AudioService.configTone(hz) });    
    },
    initToneFromRoute() {
      console.log($stateParams)
      $scope.initTone($stateParams.hz);
    },
    toggleOnOff() {
      $scope.tone.config.on = !$scope.tone.config.on;
      $scope.updateAudio($scope.tone);  
    },
    updateAudio() {
      console.log($scope.tone.config)
      AudioService.update($scope.tone.hertz, $scope.tone.config);  
    },
    showDetails() {
      $state.go('tone', { hz: $scope.tone.hertz })
    }
  });

}

module.exports = function(app) {
  app.controller('toneController', toneController)
}