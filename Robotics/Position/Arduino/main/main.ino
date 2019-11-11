char receivedChars[100];
int receivedBytes = 0;

const int motorCount = 4;
int motorSpeeds[motorCount] = {100,100,1000,1000};
int motorTicks[motorCount];


void setup(void)
{
  pinMode(8, OUTPUT);
  pinMode(9 , OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11 , OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);

  Serial.begin(115200);
  while (!Serial){};
  Serial.println("Serial port started.");
  delay(100);
  initTimer();
  digitalWrite(2, LOW);
  digitalWrite(3, LOW);
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);



  for (int i = 0; i < motorCount; i++){
    motorTicks[i] = motorSpeeds[i];
  }
 
}



void loop(){
  Serial.println("a");
    if (Serial.available() > 0){
      Serial.println("-----");
        cli();
        Serial.println("h");
        readSerial();
        sei();
    }
}
