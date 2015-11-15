require("@mohayonao/web-audio-api-shim/light");

function connect(nodes) {
  return nodes.reduce((lastNode, eachNode) => {
    if (lastNode) eachNode.connect(lastNode);
    return eachNode;
  });
}

var AudioService = function() {

  var audioContext = new AudioContext();
  var _notes = {};
  var defaultConfig = {
    binaural: true,
    on: false,
    volume: 1
  };

  var ONE_BEAT_SECONDS = 0.005;
  
  function schedulePan(beat) {
    if (beat % 2 !== 0) return;
    var leftOrRight = beat % 4 === 0 ? 1 : -1;
    Object.keys(_notes)
      .map((key) => _notes[key])
      .filter((note) => note.config.binaural)
      .forEach((note) => {
        note.nodes.stereo.pan.linearRampToValueAtTime(leftOrRight * 0.5, audioContext.currentTime + (ONE_BEAT_SECONDS  * 2));
      });
  }

  var incrementAndGetBeat = (function ()  {
    var current = -1;
    return function incrementAndGetBeat() {
      return current += 1
    }
  })();

  setInterval(() => {
    var beat = incrementAndGetBeat();
    schedulePan(beat)
    
  }, ONE_BEAT_SECONDS * 1000);

  var onPreferenceChanged = {
    binaural(note) { 
    },
    on(note) {
      if (note.config.on) {
        note.nodes.volume.connect(audioContext.destination)
      } else {
        note.nodes.volume.disconnect();
      }
    },
    volume(note) {
      note.nodes.volume.gain = note.config.volume
    }
  }

  function noteAt(hz) {
    if (!_notes[hz]) {
      var volume = audioContext.createGain();
      var flux = audioContext.createGain();
      var stereo = audioContext.createStereoPanner();
      var oscillator = audioContext.createOscillator();
      oscillator.frequency.value = hz;
      oscillator.start(0);
      connect([volume, flux, stereo, oscillator]);
      _notes[hz] = {
        nodes: {
          volume,
          flux,
          stereo,
          oscillator
        },
        config: Object.assign({}, defaultConfig)
      };
    }
    return _notes[hz];
  }

  var service = {
    configHertz: function(hz) {
      return Object.assign({}, noteAt(hz).config);
    },
    update: function(hz, modifications) {
      var original = Object.assign({}, noteAt(hz).config);
      var current = noteAt(hz)
      Object.assign(current.config, modifications);
      var modifiedKeys = Object.keys(defaultConfig).filter(
        (key) => original[key] !== modifications[key])
      modifiedKeys.forEach((key) => {
        onPreferenceChanged[key](current, modifications[key]);
      });
      return service.configHertz(hz);
    }
  }
  return service;
}
module.exports = AudioService;