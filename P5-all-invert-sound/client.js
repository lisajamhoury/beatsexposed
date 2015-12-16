
  // Start a socket connection to the server
var socket =io.connect('http://' + document.location.host);


  // Socket plays sound when it hears 'heartbeat' from server
socket.on('heartbeat', function(data) {
    //heartbeat.play(); 
    console.log('played');
} );
