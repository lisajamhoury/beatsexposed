var heartbeat;
  // Start a socket connection to the server
var socket =io.connect('http://' + document.location.host);

function preload() {
  heartbeat = loadSound('assets/beat.mp3');
}

function setup() {
  heartbeat.setVolume(1.0);

  // Socket plays sound when it hears 'heartbeat' from server
  socket.on('heartbeat', function(data) {
    heartbeat.play(); 
    console.log('played');
  } );

}

