//Parsing service is available as `Parser`

//It uses super cool `XRegExp` library under the hood, and allows readable regular expressions.
//Refer [here](http://xregexp.com/) for documentation on XRegExp

//Currently there are 4 methods to help you extend the parsing system:
// - Parser.onRegex()
// - Parser.onceOnRegex()
// - Parser.onComposition()
// - Parser.onceOnComposition()

//Look for corresponding comments to the right to get necessary information or take a look at example mods.

var xRegExp = require('xregexp').XRegExp;
/**
 * Description
 * @Constructor Parser
 * @return 
 */
function Parser() {

  var expressionMap = {};
  var composites = [];
  var onceComposites = [];
  var onceExpressionMap = {};

  /**
   * Every time parsed input matches given regular expression,
   * callback will be called with corresponding arguments
   * @method onRegex
   * @param {string} regular expression to match against. It has to be a string, not a RegExp object!
   * @param {function} callback to be called in case regular expression is matched
   * @return 
   */
  this.onRegex = function onRegex(xRegex, cb) {
    expressionMap[xRegex] = expressionMap[xRegex] || [];
    expressionMap[xRegex].push(cb);
  };

  /**
   * If parsed input matches given regular expression,
   * callback will be called only once with corresponding arguments.
   * @method onRegex
   * @param {string} regular expression to match against. It has to be a string, not a RegExp object!
   * @param {function} callback to be called in case regular expression is matched
   * @return
   */
  this.onceOnRegex = function onceOnRegex(xRegex, cb) {
    onceExpressionMap[xRegex] = onceExpressionMap[xRegex] || [];
    onceExpressionMap[xRegex].push(cb);
  };

  /**
   * This method allows you to parse list of inputs and get them as object in your callback.
   * Every time Composit.start matches the input, next inputs will be checked against Composit.content
   * and, if matched, will be added to the list of results for this Composit.
   * This will continue till some input matches Composit.end
   * Take a look at `players` mod for good examples of usage.
   * @method onComposition
   * @param {Composit} Composit object in form of
   * {
   *  start : string-regex ,
   *  content : string-regex ,
   *  end : string-regex
   * }
   * @param {function} Callback to be called after Composit.end is matched.
   * @return 
   */
  this.onComposition = function onComposition(composit, cb) {
    composit.cb = cb;
    composites.push(composit);
  };

  /**
   * This method allows you to parse list of inputs and get them as object in your callback.
   * Every time Composit.start matches the input, next inputs will be checked against Composit.content
   * and, if matched, will be added to the list of results for this Composit.
   * This will continue till some input matches Composit.end
   * Take a look at `players` mod for good examples of usage.
   * @method onComposition
   * @param {Composit} Composit object in form of
   * {
   *  start : string-regex ,
   *  content : string-regex ,
   *  end : string-regex
   * }
   * @param {function} Callback to be called after Composit.end is matched.
   * @return
   */
  this.onceOnComposition = function onceOnComposition(composit, cb) {
    composit.cb = cb;
    onceComposites.push(composit);
  }

  /**
   * Makes parser parse given data
   * @method parseData
   * @param {string} input to parse
   * @return 
   */
  this.parseData = function parseData(input) {
    checkRegexes(expressionMap, input);
    checkRegexes(onceExpressionMap, input, true);

    for (var i = 0; i < composites.length; i++) {
      var obj = composites[i];
      checkComposite(obj, input);
    }
    for (var i = 0; i < onceComposites.length; i++) {
      var obj = onceComposites[i];
      if(checkComposite(obj, input))
        composites.splice(i,1);
    }
  };

  //TODO: Consider parameters in callback by parameters name. Now passed arguments fully depend on arguments order
  /**
   * Description
   * @method checkRegexes
   * @param {Array} regexes
   * @param {string} data input to check against
   * @param {bool} removeCbOnMatch should we remove callback on match?
   * @return 
   */
  function checkRegexes(regexes, data, removeCbOnMatch) {
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


  /**
   * Checks given composite against unput.
   * @method checkComposite
   * @param {Composit} composite
   * @param {string} input
   * @return bool true if composite.end is matched. Otherwise returns false;
   */
  function checkComposite(composite, input) {
    var start = xRegExp.exec(input, xRegExp(composite.start, 'x'));
    if (!start && !composite.isComposing) return false;
    if (start && composite.isComposing) throw new Error("Composit is already composing. TROLLED!");
    composite.isComposing = true;
    var content = xRegExp.exec(input, xRegExp(composite.content, 'x'));
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
    var end = xRegExp.exec(input, xRegExp(composite.end, 'x'));
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