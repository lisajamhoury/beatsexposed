#include <RFM69.h>
#include <SPI.h> // the RFM69 library uses SPI


int ledPin = 9;


RFM69 radio;

#define myFrequency RF69_915MHZ // or RF69_433MHZ (check your radio)
int myNetwork = 147; // radios must share the same network (0-255)
int myID = 0; // radios should be given unique ID's (0-254, 255 = BROADCAST)

// our pre-defined packet structure
// this struct must be shared between all nodes
typedef struct {
  int sensor0;
  int sensor1;
  // int sensor2;
  // int sensor3;
} Packet;

void setup() {
  Serial.begin(9600);
  // setup the radio
  radio.initialize(myFrequency, myID, myNetwork);

  pinMode(ledPin, OUTPUT);

  // Serial.println("\nRADIO INITIALIZED\n");
  // Serial.println("Listening for sensor nodes...");
}


void loop() {



  // always check to see if we've received a message
  if (radio.receiveDone()) {

    // if the received message is the same size as our pre-defined Packet struct
    // then assume that it is actually one of our Packets
    // if (radio.DATALEN == sizeof(Packet)) {

    // convert the radio's raw byte array to our pre-defined Packet struct
    Packet newPacket = *(Packet*)radio.DATA;
    int senderID = radio.SENDERID;

    // if requested, acknowledge that the packet was received
    //  if (radio.ACKRequested()) {
    //   radio.sendACK();
    //  }

    Serial.print("(");
    Serial.print(senderID);
    Serial.print(")\t");
    Serial.print(newPacket.sensor0);
    Serial.print("\t");
    Serial.println(newPacket.sensor1);


    if (newPacket.sensor0 == 1) {
      
      for (int i = 0; i < 20; i++){
        digitalWrite(ledPin, HIGH);
        Serial.print("(");
        Serial.print(senderID);
        Serial.print(")\t");
        Serial.print("1");
        Serial.print("\t");
        Serial.println(newPacket.sensor1);  
       }
      } else {
      // turn LED off:
      digitalWrite(ledPin, LOW);
    }

    //      Serial.print("\t");
    //      Serial.print(newPacket.sensor2);
    //      Serial.print("\t");
    //      Serial.println(newPacket.sensor3);
    // }
    // else {
    //   Serial.println("got unknown packet!");
  }
}
