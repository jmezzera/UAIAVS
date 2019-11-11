import serial
import sys

ser = serial.Serial('/dev/serial0', 115200)
with open('./log.txt', 'w') as file:
    for line in sys.stdin:
        try:
            ser.write(line.encode('utf-8'))
        except Exception as e:
            file.write('Error {} in myserial.py'.format(e))

import atexit
@atexit.register
def close_serial():
    print("Exitting")

    try:
        ser.close()
    except:
        pass
