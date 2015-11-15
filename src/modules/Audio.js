require("@mohayonao/web-audio-api-shim/light");

function mapMethodsMatching(source, predicate, mapper) {
  var mapped = {};
  for ( var _prop in source ) {
    (function() { // anonymous function to scope variable so it doesn't get overwritten by loop
      var prop = _prop;
      if (predicate(prop)) {
        mapped[prop] = mapper(prop)
      }
    })()
  }
  return mapped;
}

function paramLink(nodeLink, param) {
  param.setValueAtTime(param.value, 0); // other set values don't work unless its initialized like this for some reason
  var schedulingPropNames = ["cancelScheduledValues", "exponentialRampToValueAtTime", "linearRampToValueAtTime", "setTargetAtTime", "setValueAtTime", "setValueCurveAtTime"];
  var schedulers = mapMethodsMatching(
    param,
    (prop) => schedulingPropNames.indexOf(prop) != -1,
    (prop) => function(value, duration, extraArgOrCallbackOption, callbackOption) {
      var callback = [callbackOption, extraArgOrCallbackOption].find((each) => typeof each === 'function');
      var extraArg = typeof extraArgOrCallbackOption !== 'function' ? extraArgOrCallbackOption : undefined;
      param[prop](value, nodeLink.context.currentTime + (duration / 1000), extraArg);
      if (callback) {
        return setTimeout(callback, duration);
      }
    });
  return Object.assign({
    nodeLink: nodeLink,
    param: param
  }, schedulers)
}

function nodeLink(_src, _node, extensions) {
  var self = _node || new AudioContext().destination;
  if (_src) {
    // link to src node
    self.connect(_src);
    self.source = _src;
  }

  // extensions is initial values for audio params such as { gain: 0.5 } or { frequency: 432 }
  if (extensions) {
    for ( var key of Object.keys(extensions) ) {
        self[key].value = extensions[key];
    }
  }

  // steal constructors (methods starting in 'create') from AudioContext
  // constructors link back up to this node
  var constructors = mapMethodsMatching(
    self.context, 
    (prop) => prop.startsWith("create"),
    (prop) => function(params) {
      return nodeLink(self, self.context[prop](), params);
    });

  var methods = {
    paramLink: function(name) {
      return paramLink(self, self[name])
    },
    reattachTo: function(nodeLink) {
      self.disconnect();
      self.source = nodeLink;
      self.connect(nodeLink);
    }
  }

  return Object.assign(self, constructors, methods)
}

module.exports = nodeLink