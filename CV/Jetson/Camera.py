#from goprocam import GoProCamera
from goprocam import constants
import cv2

class camera:

        '''def __init__(self):
                self.gopro = GoProCamera.GoPro()
                #print("cam init")
                #self.gopro.gpControlSet(constants.Stream.BIT_RATE, constants.Stream.BitRate.B2Mbps)
                #self.gopro.gpControlSet(constants.Stream.WINDOW_SIZE, constants.Stream.WindowSize.R720)
                self.gopro.gpControlSet(constants.Stream.WINDOW_SIZE, constants.Stream.WindowSize.R240)
                self.gopro.gpControlSet(constants.Stream.BIT_RATE, constants.Stream.BitRate.B600Kbps)
                #self.source = "udp://@10.5.5.9:8554"
                self.source = "udp://127.0.0.1:10000"
                self.ffmpeg_command_GUI = " -f mpegts -codec:v mpeg1video -s 640x480 -b:v 400k -bf 0 "
                self.GUI_target = "http://10.252.61.129:8080/mystream"

        def keep_alive(self):
                #print("keep alive")
                #print('HHHHHHHHHHHHHHHH:'+self.gopro.whichCam())
                self.gopro.stream(self.source+self.ffmpeg_command_GUI+self.GUI_target)

        def get_source(self):
                return self.source

        '''
        def read(self, capture, framesQueue, threadLock):
                # Capture frame-by-frame ------------------------------
                while True:
                        ret, frame = capture.read()
                        #print("ENTRO")
                        frameId = int(round(capture.get(1)))
                        if ret:
                                threadLock.acquire()
                                #print('FrameID Agregado: '+str(frameId))
                                framesQueue.append([frameId, frame])
                                threadLock.release()
