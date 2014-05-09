GameEvents.on("connect",function(){
  var repl = require('repl');
  var replServer = repl.start({
    prompt: " > ",
    input: process.stdin,
    output: process.stdout,
    useGlobal: true
  });
  replServer.on('exit', function() {
    console.log("Bye!");
  });
})