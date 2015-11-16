var SolfeggioScaleService =  function() {
  var tones = [{
    name: 'LA', 
    hertz: 852
  }, {
    name: 'SOL', 
    hertz: 741
  }, {
    name: 'FA', 
    hertz: 639
  }, {
    name: 'MI', 
    hertz: 528
  }, {
    name: 'RE', 
    hertz: 417
  }, {
    name: 'UT', 
    hertz: 396
  }];
  var toneMap = tones.reduce((map, tone) => {
    map[tone.hertz] = tone;
    return map;
  }, {})

  var service = {
    tones() {
      return tones.slice(0).map((tone) => Object.assign({}, tone))
    },
    toneAt(hz) {
      return toneMap[hz]
    }
  };
  return service;
}
module.exports = function(app) {
  app.factory('SolfeggioScaleService', SolfeggioScaleService);
};