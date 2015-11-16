function toneController($scope, $stateParams, $state, AudioService, SolfeggioScaleService) {
  return Object.assign($scope, {
    initTone(hz) {
      $scope.tone = Object.assign(SolfeggioScaleService.toneAt(hz), { config: AudioService.configTone(hz) });    
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
    },
    waveTypes: AudioService.waveTypes()
  });

}

module.exports = function(app) {
  app.controller('toneController', toneController)
}