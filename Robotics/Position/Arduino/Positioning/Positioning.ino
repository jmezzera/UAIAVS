#include <AccelStepper.h>
#include <MultiStepper.h>

#define receivedLength 100
char receivedChars[receivedLength];
int receivedBytes = 0;

const int motorCount = 4;
int motorSpeeds[motorCount] = {100, 100, 1000, 100};
int motorTicks[motorCount];

AccelStepper stepper1(AccelStepper::DRIVER, 8,2);
AccelStepper stepper2(AccelStepper::DRIVER, 9,3);
AccelStepper stepper3(AccelStepper::DRIVER, 10,4);
AccelStepper stepper4(AccelStepper::DRIVER, 11,5);

void setup(void)
{
  Serial.begin(115200);
  while (!Serial) {};
  Serial.println("Serial port started.");
  delay(100);

  for (int i = 0; i < motorCount; i++) {
    motorTicks[i] = motorSpeeds[i];
  }
  for (int i = 0; i < receivedLength; i++) {
    receivedChars[i] = 0;
  }

  stepper1.setMaxSpeed(3500);
  stepper2.setMaxSpeed(3500);
  stepper3.setMaxSpeed(3500);
  stepper4.setMaxSpeed(3500);
}



void loop() {
  if (Serial.available() > 0) {
    cli();
    readSerial();
    sei();
  }
  stepper1.runSpeed();
  stepper2.runSpeed();
  stepper3.runSpeed();
  stepper4.runSpeed();
}
