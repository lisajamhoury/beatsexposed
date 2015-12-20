//serial variables
var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbserial-DA01IC2S'; // fill in your serial port name here

//websocket variables 
var socket;

//global color variables 
var color1 = 0;
var color2 = 255;

//global sound variables 
var timestamp = 0;
var heartbeat;


// sensor variables
var myID = 0;
var heart = 0;
var breath = 0;
var prevHeart = 0;

//ball variables
var start = 500;
var target = 1000;
var diameter = start;
var light = 50;
var dark = 200;
var hueValue = light;
var lerpAmt = 0.3;
var state = 'ascending';

//flower variables 
var blendModeState = 'on';

//particles variables
var beat = 2;
var r = 0; //radius
var angle = 0;
var posX = 0;
var posY = 0;

//double random
var totalPts = 300;
var steps = totalPts + 1;

//noiseSurge variables
var noiseSurge;
var xoff = 0.0;
var xincrement = 0.005;
var heartX;

//glow variables
var otreeimg;
var treeimg;
var tree;
var ringsimg;

//growing
var circles = [];
var cCount = 0;
var pHeart = 0;
var pastTime = 0;



function preload() {
  treeimg = loadImage('assets/treerings2.png');
  ringsimg = loadImage('assets/rings.png');
  otreeimg = loadImage('assets/otree.png');
}

function setup() {
  createCanvas(1920, 1080);
  
  noCursor();
  smooth();
  noStroke();
  // heartbeat.setVolume(0.8);

  // Start a socket connection to the server
  socket =io.connect('http://' + document.location.host);


  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  // serial.list(); // list the serial ports
  serial.open(portName);
  
}

/////////////////////////// Serial Functions ///////////////////////////


function serverConnected() {
  println('connected to server.'); }

function portOpen() {
  println('the serial port opened.');
}

function serialEvent() {
  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil('\r\n');
  //check to see that there's actually a string there:
  if (inString.length > 0) {
      var sensors = split(inString, '\t'); // split the string on the commas
      if (sensors.length > 2) { // if there are three elements
        myID = sensors[0];
        if ( myID === '(1)') {
          heart = sensors[1];
          breath = sensors[2];
          if (heart === "1" && prevHeart === "0"){
            socket.emit('click', {});
            console.log('heart is 1');
          }
          prevHeart = heart;
          // console.log(myID + ", " + heart + ", " + breath);
      }
    }
  }
} 
  
function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function portClose() {
  println('The serial port closed.');
}

/////////////////////////// End Serial Functions ///////////////////////////


function draw() {
  
  if (key == 1) {
    growing();
  } else if (key == 2) {
    flower();
  } else if (key == 3) {
    tree();
  } else if (key == 4) {
    ball();
  } else if (key == 5) {
    particles();
  }else if (key == 6)  {
    doubleRandom();
  } else if (key == 7) {
    doubleRandom2();
  } else if (key == 8) {
    doubleRandom3();
  } else if (key == 9) {
    bezierLines();
  }
  else {
    growing();
  }
  if (key != 1) {
    circles = [];
  }

    if (mouseIsPressed) {
    imageMode(INVERT);
  }
}

function keyPressed() {
  growingReset();
}

function mousePressed() {
  
  if (color1 == 0) {
    color1 = 255;
    color2 = 0;
    blendModeState = 'off';
  } else {
    color1 = 0;
    color2 = 255;
    blendModeState = 'on';
  }

  // if (value == 0) {
  //   value = 255;
  // } else {
  //   value = 0;
  // }
}


//////////////////////////////////////////////////////// growing ////

function growing() {
  background(0, 10);
  // when heart beats
  if (heart == 1 && pHeart == 0) {
    cCount++;
    // every two heart beat creates a circle
    if (cCount == 2) {
      cCount = 0;
      circles.push(new Circle());
    }
  }

  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.03);
  for (var i = 0; i < circles.length; i++) {
    circles[i].run();
  }
  pop();

  pHeart = heart;
}

function growingReset() {
  pastTime = frameCount;
}

function Circle() {
  this.x = random(-(frameCount - pastTime) / 6, (frameCount - pastTime) / 6);
  this.y = random(-(frameCount - pastTime) / 6, (frameCount - pastTime) / 6);
  this.initSize = random(2, 6);
  this.size = this.initSize;

  this.run = function() {
    if (heart == 1) {
      this.size = lerp(this.size, this.initSize * 10, 0.1);
    } else {
      this.size = lerp(this.size, this.initSize, 0.05);
    }

    push();
    fill(255, 50);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
    ellipse(this.x, this.y, this.size/2, this.size/2);
    ellipse(this.x, this.y, this.size/3, this.size/3);
    pop();
  }
}


//////////////////////////////////////////////////////// ball ////


function ball() {
  background(color2, 20);
  
  if (heart == 1) {
    // target = target; //map this depending on input from stretch sensor
    state = 'ascending';
  }
  
  if (heart == 0 ) {
    state = 'descending';
  }
  
  if (state == 'ascending') {
    diameter = lerp(diameter, target, lerpAmt);
    hueValue = lerp(hueValue, dark, lerpAmt);
  }
  
  if (state == 'descending') {
    diameter = lerp(diameter, start, lerpAmt);
    hueValue = lerp(hueValue, light, lerpAmt);
  }
  
  fill(70, hueValue);
  ellipse(width/2, height/2, diameter, diameter);
  
}

////////////////////////////flower/////////////////////////


function flower() {
  angleMode(RADIANS);
  // frameRate(10);
  background(color1,10);
  // fill(color2);
  
  if (blendModeState == 'on') {
    blendMode(ADD);
  }
  
  var variant = heart*500;
  
  var sinValue = abs((sin(frameCount*0.05)))*50 + 50;
  
  translate(width/2, height/2);
  rotate(frameCount*0.005);
  for (var i = 0; i < 20; i++) {
    rotate(PI * 0.6);
    fill(color2, random(5));
    ellipse(random(100,250), random(0,5), random(sinValue,sinValue+10)*4+variant, sinValue + random(10));
  }
  
  for (var i = 0; i < 20; i++) {
    rotate(PI * 0.9);
    fill(color2,random(5));
    ellipse(random(100,250), random(0,5), random(sinValue,sinValue+10)*4+variant, sinValue + random(10));
  }
}

//////////////////////////////particles///////////////////////////////


function particles() {
  angleMode(DEGREES);
  background(color1, 70);
  // heart = Math.round(random(0, 1));


  // posX = lerp(posX, mouseX, 0.1);
  // posY = lerp(posY, mouseY, 0.1);

  
  translate(width/2, height/2);
  for (var i = 0; i < 2000; i++) {
    // rotate(PI * 0.6);
    r = random(0, width / 7);
    if (heart == 1) {
      r = r * beat;
    }
    angle = PI * 2 * r * (sin(frameCount * 30) + 10);

    // if (random(1) < 0.1) {}
    // if (frameCount % 10 == 0) {}
    
    stroke(color2, random(200, 255));
    strokeWeight(random(1, 4));
    point(posX + (r * cos(angle)), posY + (r * sin(angle)));

  }
  for (var i = 0; i < 3000; i++) {
    r = random(0, width / 2);
    angle = (0, PI * 2 * r);
    stroke(color2, random(200, 255));
    strokeWeight(random(0.5, 1));
    point(posX + (r * cos(angle)), posY + (r * sin(angle)));
  }

  for (var i = 0; i < 500; i++) {
    r = random(0, width);
    angle = (0, PI * 2 * r);
    stroke(color2, random(200, 255));
    strokeWeight(random(1, 3));
    point(posX + (r * cos(angle)), posY + (r * sin(angle)));
  }

}

////////////////////////////bezierlines////////////////////////////////////


function bezierLines() {
  angleMode(RADIANS);
  background(color1, 20);

  var pointX1 = -2500;
  var pointY1 = 0;
  var pointX2 = 1000 / 2 - 10;
  var pointY2 = 0;
  
  var input = random(1000/8, 1000/2);
  var strokeAmount = heart * 3; 

  translate(width / 2, height / 2);
  
  // stroke(255, 0, 0);
  // strokeWeight(20);
  // point(pointX1, pointY1);
  // point(pointX2, pointY2);

  for (var i = 0; i < 50; i++) {
    rotate(PI * 0.5);
    var controlPointX1 = pointX1;
    var controlPointY1 = pointY1;
    var controlPointX2 = -input * 2 + i;
    var controlPointY2 = -input * 2 + i;

    noFill();
    stroke(color2);
    strokeWeight(strokeAmount);
    bezier(
      pointX1, pointY1,
      controlPointX1, controlPointY1,
      controlPointX2, controlPointY2,
      pointX2, pointY2
    );
  }
  
  for (var i = 0; i < 50; i++) {
    rotate(PI * 0.7);
    var controlPointX1 = pointX1;
    var controlPointY1 = pointY1;
    var controlPointX2 = -input * 2 + i;
    var controlPointY2 = -input * 2 + i;

    noFill();
    stroke(color2);
    strokeWeight(strokeAmount);
    bezier(
      pointX1, pointY1,
      controlPointX1, controlPointY1,
      controlPointX2, controlPointY2,
      pointX2, pointY2
    );
  }
}

///////////////lerpped//////////////////////////////

function lerpped() { ///lerp(start, stop, amt);
  var lerped;
  var increasing;
  background(0, 10, 10, 20);
  noFill();
  stroke(255);

  var circle = 0;
  //var target = random(3000, 3500);
  var target = 1000;
  var lerpAmt = .3;
  //var origin = random(100, 120);
  var origin = 120;
  var size = origin;

  if (heart == 1) {
    //for (var y = 0; y > 1000; y+10) {
    size = lerp(size, target, lerpAmt);
    //}
  }
  if (heart == 0) {

    size = lerp(size, origin, lerpAmt);
  }
  fill(100, 100, 100, 20);
  stroke(100);
  strokeWeight(random(5));
  ellipse(width / 2, height / 2, size, size);

}

var tsize = 100;
var tangle = 0;

////////////////////////tree/////////////////////////

function tree() {

  background(10, 10, 10, 20);
  //lerp(start, stop, amt);
  // var target = random(4000, 4500);
  // var lerpAmt = .2;
  var target = 1000;
  var lerpAmt = 0.05;
  var origin = random(90, 300);
  //var size = origin;

  if (heart == 1) {
    //for (var y = 0; y > 1000; y+10) {
    tsize = lerp(tsize, target, lerpAmt);
    //}
  }
  if (heart == 0) {
    tsize = lerp(tsize, origin, lerpAmt);
  }
  tangle = tangle + heart * 0.05;

  push();
  translate(width / 2, height / 2);
  rotate(tangle + frameCount * 0.0005);
  fill(10, 10, 10, 20);
  stroke(100);
  strokeWeight(random(5));
  blendMode(LIGHTEST);
  imageMode(CENTER);
  image(treeimg, 0, 0, tsize, tsize)
    //ellipse(0, 0, size, size);
  image(treeimg, 0, 0, tsize, tsize) 
  image(otreeimg, 0, 0, tsize+500, tsize+500)
  pop();
}

///////////////////////////////doubleRandom///////////////
/// based off Ira Greenberg processing code double random

function doubleRandom() {
  background(color1, 20);
  stroke(color2);
  fill(color2);
  var rand = 0;
  for (var i = 1; i < steps; i++) {
    point((width/steps) * i, (height / 2) + random(-rand, rand));
    rand = heart*random(-500, 500);
  }
}

////////////////////////////doubleRandom2///////////////////

function doubleRandom2() {
  background(color1, 20);
  stroke(color2);
  fill(color2);
  var rand = 0;
  for (var i = 1; i < steps; i++) {
    point((width/steps) * i, (height / 2) + random(-rand, rand), 10, 10);
    rand = heart*random(-400, 400);
    
     ellipse((width/steps) * i, (height / 2) + random(-rand, rand), 10, 10);
    rand = heart*random(-100, 100);
    
     point((width/steps) * i, (height / 2) + random(-rand, rand), 10, 10);
    rand = heart*random(-400, 400);
  }
}
////////////////////////////////doubleRandom3///////////////////

function doubleRandom3() {
  background(color1, 10);
  stroke(color2);
  fill(color2);
  var rand = 0;
  for (var i = 1; i < steps; i++) {
    point((width/steps) * i, ((height / 2)+300) + random(-rand, rand), 10, 10);
    rand = heart*random(-100, 100);
    
     ellipse((width/steps) * i, (height / 2) + random(-rand, rand), 10, 10);
    rand = heart*random(-200, 200);
    
     point((width/steps) * i, ((height / 2)-300) + random(-rand, rand), 10, 10);
    rand = heart*random(-100, 100);
  }
}

