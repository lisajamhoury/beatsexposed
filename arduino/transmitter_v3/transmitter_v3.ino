#include <RFM69.h>
#include <SPI.h> // the RFM69 library uses SPI

RFM69 radio;

#define myFrequency RF69_915MHZ // or RF69_433MHZ (check your radio)
int myNetwork = 147; // radios must share the same network (0-255)
int myID = 1; // radios should be given unique ID's (0-254, 255 = BROADCAST)

int hubID = 0; // the receiver for all sensor nodes in this example

// instead of sending a string, we can send a struct
// this struct must be shared between all nodes
typedef struct {
  int sensor0;
  int sensor1;
  //int sensor2;
  //int sensor3;
} Packet;

///////////////////////////
int heartPin = 6;
int ledPin = 5;
int flex = A0;

int heartBeat = 0;

///////////////////////////

void setup() {


  // setup the radio
  radio.initialize(myFrequency, myID, myNetwork);

  // this example only uses Serial inside setup()
  // because Narcoleptic will stop Serial once used
  Serial.begin(9600);
  Serial.println("\nRADIO INITIALIZED");
  Serial.println("Sending sensor values");

  ///////////////////////////

  pinMode(ledPin, OUTPUT);
  pinMode(heartPin, INPUT);

  ///////////////////////////
}

void loop() {

  ///////////////////////////
  flex = analogRead(A0);
  heartBeat = digitalRead(heartPin);

  // check if the pushbutton is pressed.
  // if it is, the buttonState is HIGH:
  if (heartBeat == HIGH) {
    // turn LED on:
    digitalWrite(ledPin, HIGH);
  } else {
    // turn LED off:
    digitalWrite(ledPin, LOW);
  }

  

  ///////////////////////////

  // create new instance of our Packet struct
  //delay(2);

  Packet packet;
  packet.sensor0 = heartBeat;
  packet.sensor1 = flex;

  Serial.println(flex);

  int numberOfRetries = 0;

  // send reliable packet to the hub
  // notice the & next to packet when sending a struct
  // boolean gotACK = radio.sendWithRetry(hubID,  &packet, sizeof(packet), numberOfRetries);

  radio.send(hubID,  &packet, 4, 0);
  //radio.sendWithRetry(147,7, 40, 1,1);
  //radio.sendWithRetry(uint8_t toAddress, const void* buffer, uint8_t bufferSize, uint8_t retries, uint8_t retryWaitTime)

  //  if (gotACK) {
  //    Serial.println("got acknowledgment");
  //  }
  //  else {
  //    Serial.println("failed acknowledgment");
  //  }
}
