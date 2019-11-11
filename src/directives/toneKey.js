var toneKey = function() {
  return {
    restrict: 'E',
    template: `<ion-item class="tone-list-item item-dark item-icon-right has-click-target" ng-class="tone.config.on ? 'active' : 'inactive'">
                <a class="tone-details icon ion-arrow-right-c" ng-click="showDetails()">
                </a>
                <div class="toggle-tone click-target" ng-click="toggleOnOff()">
                  "{{tone.name}}" - {{tone.hertz}} Hz
                </div>
              </ion-item>`,
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