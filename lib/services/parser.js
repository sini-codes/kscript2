var xRegExp = require('xregexp').XRegExp;
function Parser() {

  //private
  var expressionMap = {};
  var onceExpressionMap = {};
  var composites = [];
  var onceComposites = [];

  this.onRegex = function onRegex(xRegex, cb) {
    expressionMap[xRegex] = expressionMap[xRegex] || [];
    expressionMap[xRegex].push(cb);
  };

  this.onceOnRegex = function onceOnRegex(xRegex, cb) {
    onceExpressionMap[xRegex] = onceExpressionMap[xRegex] || [];
    onceExpressionMap[xRegex].push(cb);
  };

  this.onComposition = function onComposition(composit, cb) {
    composit.cb = cb;
    composites.push(composit);
  };

  this.onceOnComposition = function onceOnComposition(composit, cb) {
    composit.cb = cb;
    onceComposites.push(composit);
  }

  this.parseData = function parseData(data) {
    this.checkRegexes(expressionMap, data);
    this.checkRegexes(onceExpressionMap, data, true);

    for (var i = 0; i < composites.length; i++) {
      var obj = composites[i];
      this.checkComposite(obj, data);
    }
    for (var i = 0; i < onceComposites.length; i++) {
      var obj = onceComposites[i];
      if(this.checkComposite(obj, data))
        composites.splice(i,1);
    }
  };

  //TODO: Consider parameters in callback by parameters name. Now passed arguments fully depend on arguments order
  this.checkRegexes = function checkRegexes(regexes, data, removeCbOnMatch) {
    for (var regex in regexes) {
      //Ignore system props
      if (!regexes.hasOwnProperty(regex)) continue;
      //Testing
      var match = xRegExp.exec(data, xRegExp(regex, 'x'));
      if (!match) continue;

      //Remove input itself
      match.splice(0, 1);

      //Calling each registered callback
      var expressionCallbacks = regexes[regex];
      for (var i = 0; i < expressionCallbacks.length; i++) {
        var cb = expressionCallbacks[i];
        cb.apply(null, match);
        if (removeCbOnMatch)
          expressionCallbacks.splice(i,1);
      }

    }
  }

  //We operate directly on composite which may be changed outside of the scope - what a shame, but I'm LAZYYY.
  this.checkComposite = function checkComposite(composite, data) {
    var start = xRegExp.exec(data, xRegExp(composite.start, 'x'));
    if (!start && !composite.isComposing) return false;
    if (start && composite.isComposing) throw new Error("Composit is already composing. TROLLED!");
    composite.isComposing = true;
    var content = xRegExp.exec(data, xRegExp(composite.content, 'x'));
    if (content) {

      content.splice(0, 1);

      delete content.input;
      delete content.index;
      for (var prop in content) {
        if (!typeof prop == 'object' || !content.hasOwnProperty(prop)) delete content[prop];
      }
      console.dir(content);
      composite.results = composite.results || [];
      composite.results.push(content);
    }
    var end = xRegExp.exec(data, xRegExp(composite.end, 'x'));
    if (end) {
      composite.isComposing = false;
      composite.cb(composite.results);
      delete composite.results;
      return true;
    }
    return false;
  }


}

module.exports = new Parser();