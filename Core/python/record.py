import sys
import cv2
import threading
import datetime

SOURCE = 'udp://192.168.1.109:10001'
def record_video(record):
    fourcc = cv2.VideoWriter_fourcc('X', '2', '6', '4') # for .mp4
    cap = cv2.VideoCapture(SOURCE)
    
    while True:
        if record.record:
            #OUTPUT_NAME = '/home/juan/UAIAVS/Core/static/videos/' + str(datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')) + '.mp4'
            OUTPUT_NAME = '/home/juan/UAIAVS/Core/static/videos/final.mp4'
            print(OUTPUT_NAME)
            writer = cv2.VideoWriter(OUTPUT_NAME, fourcc, int(cap.get(5)), (640,360))
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
