require("@mohayonao/web-audio-api-shim/light");

function connect(nodes) {
  return nodes.reduce((lastNode, eachNode) => {
    if (lastNode) eachNode.connect(lastNode);
    return eachNode;
  });
}

var AudioService = function() {

  var audioContext = new AudioContext();
  var root = audioContext.createGain();
  root.gain.value = 0.5;
  root.connect(audioContext.destination)
  var _tones = {};
  var defaultConfig = {
    binaural: false,
    on: false,
    volume: 0.2,
  };

  var BEAT_DURATION = 0.05;
  var BEATS_PER_SCHEDULE = 40;
  var BEATS_PER_SECOND = 1 / BEAT_DURATION;

  function currentBeatTime() {
    var currentTime = audioContext.currentTime;
    return currentTime - (currentTime % BEAT_DURATION);
  }

  function schedulePan() {
    var binaurals = Object.keys(_tones)
      .map((key) => _tones[key])
      .filter((tone) => tone.config.binaural);
    var base = currentBeatTime();

    for (var beat = 0; beat < BEATS_PER_SCHEDULE / 2; beat++) {
      var leftOrRight = beat % 2 === 0 ? 1 : -1;
      binaurals
        .forEach((tone) => {
          tone.nodes.stereo.pan.linearRampToValueAtTime(leftOrRight * 1, base + (beat * BEAT_DURATION  * 2));
        });
    }
  }

  setInterval(() => {
    schedulePan()
    
  }, BEAT_DURATION * 1000 * BEATS_PER_SCHEDULE);

  var onPreferenceChanged = {
    binaural(tone) { 
    },
    on(tone) {
      if (tone.config.on) {
        tone.nodes.volume.connect(root)
      } else {
        tone.nodes.volume.disconnect();
      }
    },
    volume(tone) {
      console.log('change volume to' + tone.config.volume);
      tone.nodes.volume.gain.value = tone.config.volume
    },
    binaural(tone) {
      if (!tone.config.binaural) {
        var pan = tone.nodes.stereo.pan;
        pan.cancelScheduledValues(0);
        pan.value = 0;
      } else {
        schedulePan()
      }
    }
  }

  function noteAt(hz) {
    if (!_tones[hz]) {
      var volume = audioContext.createGain();
      var flux = audioContext.createGain();
      var stereo = audioContext.createStereoPanner();
      var oscillator = audioContext.createOscillator();
      try {
        oscillator.frequency.value = hz;
      } catch (e) {
        throw new Error(`Expected number. Cannot configure hertz ${JSON.stringify(hz)}`)
      }

      oscillator.start(0);
      connect([volume, flux, stereo, oscillator]);
      _tones[hz] = {
        nodes: {
          volume,
          flux,
          stereo,
          oscillator
        },
        config: Object.assign({}, defaultConfig)
      };
    }
    return _tones[hz];
  }

  var service = {
    configTone: function(hz) {
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
      return service.configTone(hz);
    }
  }
  return service;
}

module.exports = function(app) {
  app.factory('AudioService', AudioService);
}

