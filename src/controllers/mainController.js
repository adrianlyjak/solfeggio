function mainController($scope, ToneService) {
  
  Object.assign($scope, {
    tones: ToneService.tones()
  });
  
}

module.exports = function(app) {
  app.controller('mainController', mainController);
}
