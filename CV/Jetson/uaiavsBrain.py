import cv2
import requests
import numpy as np
import tensorflow as tf
import tensorflow.compat.v1 as tfc
import tensorflow.contrib.tensorrt as trt
# import ffmpeg

# modules -----------------------------------
import DecisionMaker as dm
import Camera as cam
from uaiavsUtils import *
from connectionHandler import connectionHandler

# aux ---------------------------------------
#from optparse import OptionParser
from time import time, sleep
import signal
import datetime
import threading
from collections import deque
from queue import Queue

# config constants --------------------------
SAVE_OUTPUT = False
DRAW_DETECTION = False
SAVE_PATH = "Videos/"+datetime.datetime.now().strftime("%d-%m-%Y_%H-%M-%S")+".mp4"
# robotics constants ------------------------
MOTOR_API = "http://192.168.1.108:8080/"
MOTOR_API_DUMP = "http://ptsv2.com/t/uaiavs/post"
MOVE_DELTA_ENDPOINT = "moveDir"
# predict constants -------------------------
PB_FNAME = "./model/our_ssd_graph_only_player2.pb"
INPUT_NAMES = ['image_tensor']
DETECTION_TH = 0.1

# camera is used in both threads
#camera = cam.camera()

def signal_handler(signal, frame):
	out.release()
	capture.release()
	cv2.destroyAllWindows()
	

def predict(decision_maker, framesQueue, threadLock, inst_to_send, threadLockInst):	
	# Create session and load graph
	trt_graph = get_frozen_graph(PB_FNAME)
	tf_config = tfc.ConfigProto()
	tf_config.gpu_options.allow_growth = True
	tf_sess = tfc.Session(config=tf_config)
	tf.import_graph_def(trt_graph, name='')

	tf_input = tf_sess.graph.get_tensor_by_name(INPUT_NAMES[0] + ':0')
	tf_scores = tf_sess.graph.get_tensor_by_name('detection_scores:0')
	tf_boxes = tf_sess.graph.get_tensor_by_name('detection_boxes:0')
	tf_classes = tf_sess.graph.get_tensor_by_name('detection_classes:0')
	tf_num_detections = tf_sess.graph.get_tensor_by_name('num_detections:0')
	tf_input.shape.as_list()

	while True:
		threadLock.acquire()
		frameId = framesQueue[-1][0]
		print('reading FrameId: '+str(frameId))
		frame = framesQueue[-1][1]
		threadLock.release()
		# aux image used to predict
		image = frame.copy()
		image = cv2.resize(image, (300, 300))
		
		start_time = time()
		# find player location --------------------------------
		scores, boxes, classes, num_detections = tf_sess.run([tf_scores, tf_boxes, tf_classes, tf_num_detections], feed_dict={
			tf_input: image[None, ...]
		})
		boxes = boxes[0]  # index by 0 to remove batch dimension
		scores = scores[0]
		classes = classes[0]
		num_detections = int(num_detections[0])

		bbox, max_score = get_player_detection(image, boxes, scores, classes, num_detections, DETECTION_TH)
		print("bbox: ", bbox, "- score: ", max_score)
		# write video -----------------------------------------
		if DRAW_DETECTION and len(bbox)!=0:
			h,w,c = image.shape
			box = [bbox[0]*h, bbox[1]*w, bbox[2]*h, bbox[3]*w]
			box = np.round(box).astype(int)
			image = cv2.rectangle(image, (box[1], box[0]), (box[3], box[2]), (0, 255, 0), 2)
			label = "{}:{:.2f}".format(int(classes[0]), max_score)
			# Draw label (class index and probability).
			draw_label(image, (box[1], box[0]), label)
		if SAVE_OUTPUT:
			#out.write(frame)
			save_image(image[:, :, ::-1], fname="./Images101119/model2/"+str(frameId)+"_"+datetime.datetime.now().strftime("%d-%m-%Y_%H-%M-%S")+".png")
			save_image(frame[:, :, ::-1], fname="./Images101119/model2Frame/"+str(frameId)+"_"+datetime.datetime.now().strftime("%d-%m-%Y_%H-%M-%S")+".png")
		#cv2.imshow("GoPro OpenCV", result_image)
		#if cv2.waitKey(1) & 0xFF == ord('q'):
		# 	break
		# make decision ---------------------------------------
		if len(bbox)!= 0:
			bbox = [bbox[1], bbox[0], bbox[3], bbox[2]]
		inst = decision_maker.decide(bbox, max_score)
		print("PREDICT INSTRUCTION: ", inst)
		elapsed_time = time() - start_time
		# move mechanics -------------------------------------
		threadLockInst.acquire()
		inst_to_send.inst = inst
		threadLockInst.release()
		print("Elapsed time: %0.10f seconds." % elapsed_time)
		#body = '{"x":' + str(inst[0]*3) + ',"y":' + str(inst[1]*3) + ',"z":' + str(inst[2]*3) + ',"time": 0.2}'
		#r_move_motor = requests.post(MOTOR_API+MOVE_DELTA_ENDPOINT, data=body, headers={"content-type": "application/json"})
                #r_move_motor = requests.post(url=MOTOR_API_DUMP, json={"x": inst[0], "y": inst[1], "z": inst[2], "time": 1})
		#print(r_move_motor.status_code)
		#if r_move_motor.status_code != 200:
		#       # TODO error cancelar
		#	print("ERROR")
	cv2.destroyAllWindows()
	tf_sess.close()

	# for testing purposes ----------------------
	#xmin = int(options.xmin)
	#xmax = int(options.xmax)
	#ymin = int(options.ymin)
	#ymax = int(options.ymax)

	#inst = decision_maker.decide([xmin, ymin, xmax, ymax])
	#print(inst)
	# --------------------------------------------

class MyInst:
    def __init__(self, inst):
        self.inst = inst

if __name__ == "__main__":
	camera = cam.camera()
	
	sleep(60)
	#keep_alive_thread = threading.Thread(target=camera.keep_alive)
	#keep_alive_thread.start()

	framesQueue = deque([], maxlen=5)
	threadLock = threading.Lock() 
	threadLockInst = threading.Lock()

	#capture.set(6, cv2.CV_FOURCC('H','2','6','4'))
	capture = cv2.VideoCapture("udp://192.168.1.109:10000")
	read_thread = threading.Thread(target=camera.read, args=[capture, framesQueue, threadLock])
	read_thread.start()

	size = (int(capture.get(3)), int(capture.get(4)))
	decision_maker = dm.decision_maker(size)

	# fourcc = cv2.VideoWriter_fourcc(*"DIVX") # for .avi
	fourcc = cv2.VideoWriter_fourcc('m', 'p', '4', 'v') # for .mp4
	# fourcc = cv2.VdeoWriter_fourcc('M', 'J', 'P', 'G') # for hq MJPG
	# out = cv2.VideoWriter(SAVE_PATH, fourcc, int(capture.get(5)), size)

	#inst_queue = Queue()
	inst = MyInst(dm.instruction(0,0,0))

	ch = connectionHandler(MOTOR_API+MOVE_DELTA_ENDPOINT)
	ch_thread = threading.Thread(target=ch.run, args=[inst, threadLockInst])

	main_thread = threading.Thread(target=predict, args=[decision_maker, framesQueue, threadLock, inst, threadLockInst])
	main_thread.start()
	sleep(30)
	ch_thread.start()
	read_thread.join()
	main_thread.join()
	ch_thread.join()
	signal.signal(signal.SIGINT, signal_handler)
