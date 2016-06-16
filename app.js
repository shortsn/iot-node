var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , conf = require('./config.json')
  , bodyParser = require('body-parser')
  , fs = require('fs');

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
      console.log(filename + " saved");
      res.sendStatus(200);
    });
  });

var counter = 0;
var connections = 0;

var id = setInterval(function () {
  if (connections > 0) {
    io.emit("fump", JSON.stringify({ value: counter++ }));
  }
}, 1000);

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

server.listen(conf.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  // http://localhost:8080/#source=dashboard
  console.log('Dashboard running at http://%s:%s', host, port);
});