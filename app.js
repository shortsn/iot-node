var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ server: server })
  , express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , port = 8080;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/Site'));

// var five = require("johnny-five");
// var board = new five.Board();

// board.on("ready", function() {
//   // Create an Led on pin 13
//   var led = new five.Led(13);
//   // Blink every half second
//   led.blink(50);
// });

app.route('/dashboard')
  .put(function (req, res) {
    if (!req.is('application/json')) {
      res.status(406).send('Not Acceptable');
      return;
    }
    console.log(req.body)
    res.sendStatus(200);
  });

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  var counter = 0;  
  var id = setInterval(function () {
    ws.send(JSON.stringify({ value : counter++ }), function () { /* ignore errors */ });
  }, 1000);
  console.log('started client interval');
  ws.on('close', function () {
    console.log('stopping client interval');
    clearInterval(id);
  });
});

server.on('request', app);
server.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  // http://localhost:8080/#source=dashboard
  console.log('Dashboard running at http://%s:%s', host, port);
});