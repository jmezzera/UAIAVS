void parseReadings(char text[]){
  int index = 0;
  for (int i = 0; i < motorCount; i++){
    char currentValue[25];
    for (int j = 0; j < 25; j++){
      currentValue[j] = 0;
    }
    int currentCount = 0;
    char currentChar = text[index];
    
    while (currentChar != ','){
      currentValue[currentCount] = currentChar;
      currentCount++;
      index++;
      currentChar = text[index];
    }
    index++;
    motorSpeeds[i] = String(currentValue).toInt();
    Serial.println("Motor " + String(i) + " " + String(currentValue));


  }
}

void readSerial(){
    char receivedByte = Serial.read();
    if (receivedByte != 13){
        receivedChars[receivedBytes] = receivedByte;
        receivedBytes++;

    } else {
        //Serial.println("Line received!");
        Serial.println(String(receivedChars));

        parseReadings(receivedChars);

//        for (int j = 0; j < motorCount; j++){
//          Serial.println(motorSpeeds[j]);
//        }

        for (int i = 0; i <= receivedBytes; i++){
          receivedChars[i] = 0;
        }
        receivedBytes = 0;
        receivedByte = -1;
    }
}
