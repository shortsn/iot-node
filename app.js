var express = require('express');
var app     = express();

app.use(express.static(__dirname + '/Site'));


// var five = require("johnny-five");
// var board = new five.Board();

// board.on("ready", function() {
//   // Create an Led on pin 13
//   var led = new five.Led(13);
//   // Blink every half second
//   led.blink(50);
// });

var server = app.listen(8080, function() {

    var host = server.address().address;
    var port = server.address().port;

    // http://localhost:8080/#source=dashboardS
    console.log('Dashboard running at http://%s:%s', host, port);
});
