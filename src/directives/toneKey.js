var toneKey = function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/tonekey.html',
    controller: 'toneController',
    scope: {
      tone: '='
    },
    link:function(scope, elem, attrs, toneController){
      if (scope.tone) toneController.initTone(scope.tone);
      
    }
  };
}

module.exports = function(app) {
  return app.directive('toneKey', toneKey)
}