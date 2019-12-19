import sys
import cv2
import threading
import datetime


SOURCE = 'udp://192.168.1.109:10001'
OUTPUT_NAME = 'output_video.mp4'

def record_video(record):
    fourcc = cv2.VideoWriter_fourcc('m', 'p', '4', 'v') # for .mp4
    cap = cv2.VideoCapture(SOURCE)
    OUTPUT_NAME = '../static/videos/' + str(datetime.datetime.now()) + '.mp4'
    while True:
        if record.record:
            writer = cv2.VideoWriter(, fourcc, int(cap.get(5)), (640,360))
            print("recordingThread......")
            while True:
                if not record.record:
                    break
                ret, frame = cap.read()
                if ret==True:
                    #frame = cv2.flip(frame,0)

                    # write the flipped frame
                    writer.write(frame)
                else:
                    break
            writer.release()

    cap.release()
    


class Record:

    def __init__(self):
        self.record = False


if __name__ == '__main__':

    record = Record()

    record_video_thread = threading.Thread(target=record_video, args=[record])
    record_video_thread.start()

    for line in sys.stdin:
        print(line)
        if str(line) == 'start\n':
            record.record = True
            print("recording......")
        elif line == 'stop\n':
            record.record = False
            print("stopping......")
