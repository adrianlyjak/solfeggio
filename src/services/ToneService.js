var ToneService =  function() {
  var solfeggioTones = [{
    name: 'la', 
    hertz: 852,
    description: 'blah blah'
  }, {
    name: 'sol', 
    hertz: 741,
    description: 'blah blah'
  }, {
    name: 'fa', 
    hertz: 639,
    description: 'blah blah'
  }, {
    name: 'mi', 
    hertz: 528,
    description: 'blah blah'
  }, {
    name: 're', 
    hertz: 417,
    description: 'blah blah'
  }, {
    name: 'ut', 
    hertz: 396,
    description: 'blah blah'
  }];

  var others = [{
    name: 'A',
    hertz: 432,
    description: 'blah blah'
  }]

  var toneMap = solfeggioTones.concat(others).reduce((map, tone) => {
    map[tone.hertz] = tone;
    return map;
  }, {})

  var service = {
    tones() {
      return solfeggioTones.concat(others).slice(0).map((tone) => Object.assign({}, tone))
    },
    toneAt(hz) {
      return toneMap[hz]
    }
  };
  return service;
}
module.exports = function(app) {
  app.factory('ToneService', ToneService);
};