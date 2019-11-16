import tensorflow as tf
import tensorflow.compat.v1 as tfc
import numpy as np
import cv2
import time
import datetime
import os
from uaiavsUtils import *

PB_FNAME = "../ssd_graph.pb"
INPUT_NAMES = ['image_tensor']
TEST_IMAGE = "./testImage.png"
DETECTION_TH = 0.1

# Create session and load graph
trt_graph = get_frozen_graph(PB_FNAME)
tf_config = tfc.ConfigProto()
#tf_config.gpu_options.allow_growth = True
tf_sess = tfc.Session(config=tf_config)
tf.import_graph_def(trt_graph, name='')

tf_input = tf_sess.graph.get_tensor_by_name(INPUT_NAMES[0] + ':0')
tf_scores = tf_sess.graph.get_tensor_by_name('detection_scores:0')
tf_boxes = tf_sess.graph.get_tensor_by_name('detection_boxes:0')
tf_classes = tf_sess.graph.get_tensor_by_name('detection_classes:0')
tf_num_detections = tf_sess.graph.get_tensor_by_name('num_detections:0')
tf_input.shape.as_list()

frame = cv2.imread(TEST_IMAGE)
# aux image used to predict
image = frame.copy()
image = cv2.resize(image, (300, 300))

#start_time = time()
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
# write image -----------------------------------------
if len(bbox)!=0:
	h,w,c = image.shape
	#print(h," - ",w," - ",c)
	box = [bbox[0]*h, bbox[1]*w, bbox[2]*h, bbox[3]*w]
	box = np.round(box).astype(int)
	image = cv2.rectangle(image, (box[1], box[0]), (box[3], box[2]), (0, 255, 0), 2)
	label = "{}:{:.2f}".format(int(classes[0]), max_score)
	# Draw label (class index and probability).
	draw_label(image, (box[1], box[0]), label)
	save_image(image[:, :, ::-1])