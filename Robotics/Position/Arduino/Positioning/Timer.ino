void initTimer() {
  cli();
  TCCR0A = 0;// set entire TCCR0A register to 0
  TCCR0B = 0;// same for TCCR0B
  TCNT0  = 0;//initialize counter value to 0
  OCR0A = 75;// = (16*10^6) / (0.1*10^6*8) - 1 (must be <256)
  // turn on CTC mode
  TCCR0A |= (1 << WGM01);
  // Set CS01 bit for 8 prescaler
  TCCR0B |= (1 << CS01) ;
  // enable timer compare interrupt
  TIMSK0 |= (1 << OCIE0A);
  sei();
}

ISR(TIMER0_COMPA_vect) {
  for (int i = 0; i < motorCount; i++) {
    if (--motorTicks[i] == 0) {
      PORTB ^= 1UL << i;
      motorTicks[i] = motorSpeeds[i];
    }
  }
}

