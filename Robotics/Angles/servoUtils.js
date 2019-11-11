const SERVO_ANGLE_MIN = 0;
const SERVO_ANGLE_MAX = 180;
const SERVO_PULSE_MIN = 550;
const SERVO_PULSE_MAX = 2500;

const Gpio = require('pigpio').Gpio;

const angleToPulse = angle => parseInt((angle - SERVO_ANGLE_MIN) * (SERVO_PULSE_MAX - SERVO_PULSE_MIN) / (SERVO_ANGLE_MAX - SERVO_ANGLE_MIN) + SERVO_PULSE_MIN);

const createPin = pinNumber => new Gpio(pinNumber, {mode: Gpio.OUTPUT});

const writeAngle = (pin, angle) => {
    if (angle < SERVO_ANGLE_MIN || angle > SERVO_ANGLE_MAX)
        throw new RangeError(`The angle should be in the range [${SERVO_ANGLE_MIN}°;${SERVO_ANGLE_MAX}]. ${angle} received`);
    pin.servoWrite(angleToPulse(angle))
};

module.exports = {createPin, writeAngle}
