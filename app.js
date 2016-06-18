var express = require('express')
  , fs = require('fs')
  , conf = require('./config.json')
  , app = express()
  , bodyParser = require('body-parser')
  , server
  , options;

if (conf.ssl) {
  var https = require('https');
  options = {
    port: conf.https.port,
    cert: fs.readFileSync(conf.https.cert, 'utf8'),
    key: fs.readFileSync(conf.https.key, 'utf8')
  };
  server = https.createServer(options, app);
} else {
  var http = require('http');
  options = {
    port: conf.http.port
  };
  server = http.createServer(app);
}

var io = require('socket.io').listen(server)
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
    var filename = __dirname + "/Site/dashboard.json"
    fs.writeFile(filename, JSON.stringify(req.body, null, '\t'), function (err) {
      if (err) return console.log(err);
      console.log("Dashboard saved ->" + filename);
      res.sendStatus(200);
    });
  });

var counter = 0;
var connections = 0;

var id = setInterval(function () {
  if (connections > 0) {
    counter++
    io.emit("foo", JSON.stringify({ foo: counter*1.5 }));
    io.emit("bar", JSON.stringify({ bar: counter*2.5 }));
  }
}, 500);

io.on('connection', function (socket) {
  connections++;
  console.log("New client connected.");
  // On subscribe events join client to room
  socket.on('subscribe', function(room) {
    socket.join(room);
    console.log("Client joined room: " + room);
  });
      
  // On disconnect events
  socket.on('disconnect', function(socket) {
    console.log("Client disconnect from rooms.");
    connections--;
  });
});

server.listen(options, function () {
  var host = server.address().address;
  var port = server.address().port;

  // http://localhost:8080/#source=dashboard
  console.log('Dashboard running at http://%s:%s', host, port);
});