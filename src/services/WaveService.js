var waveNames = ["01_Saw",
"02_Triangle",
"03_Square",
"04_Noise",
"05_Pulse",
"06_Warm_Saw",
"07_Warm_Triangle",
"08_Warm_Square",
"09_Dropped_Saw",
"10_Dropped_Square",
"11_TB303_Square",
"Bass",
"Bass_Amp360",
"Bass_Fuzz",
"Bass_Fuzz_ 2",
"Bass_Sub_Dub",
"Bass_Sub_Dub_2",
"Brass",
"Brit_Blues",
"Brit_Blues_Driven",
"Buzzy_1",
"Buzzy_2",
"Celeste",
"Chorus_Strings",
"Dissonant Piano",
"Dissonant_1",
"Dissonant_2",
"Dyna_EP_Bright",
"Dyna_EP_Med",
"Ethnic_33",
"Full_1",
"Full_2",
"Guitar_Fuzz",
"Harsh",
"Mkl_Hard",
"Organ_2",
"Organ_3",
"Phoneme_ah",
"Phoneme_bah",
"Phoneme_ee",
"Phoneme_o",
"Phoneme_ooh",
"Phoneme_pop_ahhhs",
"Piano",
"Putney_Wavering",
"Throaty",
"Trombone",
"Twelve%20String%20Guitar%201",
"Twelve_OpTines",
"Wurlitzer",
"Wurlitzer_2"];



function WaveService($http) {
  var waveJsons = {};
  waveNames.forEach((name) => {
    $http({
          method: 'GET',
          url: 'http://chromium.googlecode.com/svn/trunk/samples/audio/wave-tables/' + name,
          transformResponse: function(data) {
            eval("var answer = (" + data.replace(/'/g, '') + ")")
            return answer;
          }
        })
      .then((response) => {
        console.log(response.data);
        waveJsons[name] = response.data;
      });
  });
  return {
    waves() {
      return waveJsons;
    }
  }
}

module.exports = (app) => {
  app.factory('WaveService', WaveService)
}
