require("@mohayonao/web-audio-api-shim/light");

function connect(nodes) {
  return nodes.reduce((lastNode, eachNode) => {
    if (lastNode) eachNode.connect(lastNode);
    return eachNode;
  });
}

var AudioService = function(WaveService) {

  var audioContext = new AudioContext();
  var _tones = {};
  var defaultConfig = {
    binaural: false,
    on: false,
    volume: 1,
    waveType: 'sine'
  };

  var BEAT_DURATION = 0.05;
  
  function schedulePan(beat) {
    if (beat % 2 !== 0) return;
    var leftOrRight = beat % 4 === 0 ? 1 : -1;
    Object.keys(_tones)
      .map((key) => _tones[key])
      .filter((tone) => tone.config.binaural)
      .forEach((tone) => {
        tone.nodes.stereo.pan.linearRampToValueAtTime(leftOrRight * 1, audioContext.currentTime + (BEAT_DURATION  * 2));
      });
  }

  var beatCount = -1;
  setInterval(() => {
    var beat = beatCount += 1;
    schedulePan(beat)
    
  }, BEAT_DURATION * 1000);

  var onPreferenceChanged = {
    binaural(tone) { 
    },
    on(tone) {
      if (tone.config.on) {
        tone.nodes.volume.connect(audioContext.destination)
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
      }
    },
    waveType(tone) {
      var wave = waveTypes[tone.config.waveType];
      if (typeof wave === 'string') {
        tone.nodes.oscillator.type = wave;  
      } else {
        tone.nodes.oscillator.setPeriodicWave(loadWaveForm(wave));
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


  function loadWaveForm(waveForm) {
    var real = new Float32Array(waveForm.real);
    var imag = new Float32Array(waveForm.imag);
    return audioContext.createPeriodicWave(real, imag);
  }
  var waveTypes = {
    sine: 'sine',
    triangle: 'triangle',
    square: 'square',
    sawtooth: 'sawtooth'
  };
  setTimeout(() => {
    Object.assign(waveTypes, WaveService.waves());
  }, 1000)


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
    },
    waveTypes() {
      return Object.keys(waveTypes)
    }
  }
  return service;
}

module.exports = function(app) {
  app.factory('AudioService', AudioService);
}

