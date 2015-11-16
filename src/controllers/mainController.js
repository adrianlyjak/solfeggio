function mainController($scope, SolfeggioScaleService) {
  
  Object.assign($scope, {
    tones: SolfeggioScaleService.tones()
  });
  
}

module.exports = function(app) {
  app.controller('mainController', mainController);
}
