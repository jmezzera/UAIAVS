# from goprocam import GoProCamera
from goprocam import constants
from stream import GoProCamera
# import cv2

class camera:

        def __init__(self):
                # self.gopro = GoProCamera.GoPro()
                self.gopro = GoProCamera()
                #print("cam init")
                self.gopro.gpControlSet(constants.Stream.BIT_RATE, constants.Stream.BitRate.B2Mbps)
                self.gopro.gpControlSet(constants.Stream.WINDOW_SIZE, constants.Stream.WindowSize.R720)
                # self.gopro.gpControlSet(constants.Stream.WINDOW_SIZE, constants.Stream.WindowSize.R240)
                # self.gopro.gpControlSet(constants.Stream.BIT_RATE, constants.Stream.BitRate.B600Kbps)
                #self.source = "udp://@10.5.5.9:8554"
                self.options = " -codec:v mpeg2video -s 640x360 -an "
                self.source = "udp://192.168.1.147:10000"
                self.ffmpeg_command_GUI = " -f mpegts -codec:v mpeg1video -s 640x480 -b:v 400k -bf 0 -an "
                #self.ffmpeg_command_GUI = " -f mp4 -codec:v libx264 -s 640x480 -b:v 400k -bf 0 -an "

                self.GUI_target = "http://localhost:8080/mystream"
                #self.GUI_target = "http://10.0.0.102:8080/mystream"
                #self.save_output_as_mp4 = " output.mp4"
                #self.second_command = " -fflags nobuffer -flags low_delay -s 640x480 -b:v 800k -r 30 -an -f mpegts udp://127.0.0.1:10000"
                #self.prueba_record = "udp://127.0.0.1:10000 -b:v 800k -r 30 -f mpegts udp://127.0.0.1:10001"

        def keep_alive(self):
                #print("keep alive")
                self.gopro.stream(self.options+self.source+self.ffmpeg_command_GUI+self.GUI_target)
                #self.gopro.stream(self.options+self.source)


        def get_source(self):
                return self.source

        # def read(self, capture, framesQueue, threadLock):
        #         # Capture frame-by-frame ------------------------------
        #         while True:
        #                 ret, frame = capture.read()
        #                 frameId = int(round(capture.get(1)))
        #                 if ret:
        #                         threadLock.acquire()
        #                         print('FrameID Agregado: '+str(frameId))
        #                         framesQueue.append([frameId, frame])
        #                         threadLock.release()


if __name__ == "__main__":

        cam = camera()
        cam.keep_alive()