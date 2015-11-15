var SolfeggioScaleService =  function() {
  var notes = [{
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

  return {
    notes() {
      return notes.slice(0).map((note) => Object.assign({}, note))
    }
  };
}
module.exports =  SolfeggioScaleService;