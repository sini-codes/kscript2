var jazz = require('jazz');

var template = '/msg "{arg}"';

var compTemplate = jazz.compile(template,function(){

});

compTemplate.eval({arg:"Hello world!"},function(res){
  console.log(res);
});

