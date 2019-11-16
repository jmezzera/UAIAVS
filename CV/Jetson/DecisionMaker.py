from collections import deque
import operator

# (x, y, z) z=0 por default
# x = -1 left / 1 right; y = -1 backward / 1 forward; 
MOVE_FORWARD = (1, 0, 0)
MOVE_LEFT = (0, 1, 0)
MOVE_RIGHT = (0, -1, 0)
MOVE_BACKWARD = (-1, 0, 0)
MOVE_TOP_LEFT = (1, 1, 0)
MOVE_TOP_RIGHT = (1, -1, 0)
MOVE_BOTTOM_LEFT = (-1, 1, 0)
MOVE_BOTTOM_RIGHT = (-1, -1, 0)
STAY_STILL = (0, 0, 0)
DETECTION_LOST = (-1, -1, -1)

class decision_maker:

	def __init__(self, size):
		self.img_width = size[0]
		self.img_height = size[1]
		# [xmin, ymin, xmax, ymax]
		self.q1 = quadrant(0, 0, self.img_width/3, self.img_height/3)
		self.q2 = quadrant(self.img_width/3, 0, 2*self.img_width/3, self.img_height/3)
		self.q3 = quadrant(2*self.img_width/3, 0, self.img_width, self.img_height/3)
		self.q4 = quadrant(0, self.img_height/3, self.img_width/3, 2*self.img_height/3)
		self.q5 = quadrant(self.img_width/3, self.img_height/3, 2*self.img_width/3, 2*self.img_height/3)
		self.q6 = quadrant(2*self.img_width/3, self.img_height/3, self.img_width, 2*self.img_height/3)
		self.q7 = quadrant(0, 2*self.img_height/3, self.img_width/3, self.img_height)
		self.q8 = quadrant(self.img_width/3, 2*self.img_height/3, 2*self.img_width/3, self.img_height)
		self.q9 = quadrant(2*self.img_width/3, 2*self.img_height/3, self.img_width, self.img_height)
		
		self.detections_lost_th = 10
		self.detections_lost_counter = 0
		self.previous_insts = deque([[STAY_STILL, 0]], maxlen=5) 


	def decide(self, bbox, score):
		# case: player is not detected, no detections send
		print('TOMO DECISION')
		print('DM BBOX: ', bbox)
		if len(bbox) == 0:
			print('ME PERDI XXXXXXXXXXXX')
			if (self.detections_lost_counter <= self.detections_lost_th):
				self.detections_lost_counter = self.detections_lost_counter + 1
				return self.history_based_decision()
			elif (self.detections_lost_counter > self.detections_lost_th):
				#self.detections_lost_counter = 0
				inst = DETECTION_LOST
				# TODO
				# qué hacemos cuando se pierde el jugador
		else:
			# detection found
			print('ME ENCONTRE *******************************************')
			self.detections_lost_counter = 0
			bbox = [bbox[0]*self.img_width, bbox[1]*self.img_height, bbox[2]*self.img_width, bbox[3]*self.img_height]
			# detection found
			self.detections_lost_counter = 0	
			# other
			center = point((bbox[0]+bbox[2])/2, (bbox[1]+bbox[3])/2)
			inst = ""
			if (center.x >= self.q1.xmin and center.x < self.q1.xmax) and (center.y >= self.q1.ymin and center.y < self.q1.ymax):
				inst = MOVE_TOP_LEFT
			elif (center.x >= self.q2.xmin and center.x < self.q2.xmax) and (center.y >= self.q2.ymin and center.y < self.q2.ymax):
				inst = MOVE_FORWARD
			elif (center.x >= self.q3.xmin and center.x < self.q3.xmax) and (center.y >= self.q3.ymin and center.y <= self.q3.ymax):
				inst = MOVE_TOP_RIGHT
			elif (center.x >= self.q4.xmin and center.x < self.q4.xmax) and (center.y >= self.q4.ymin and center.y < self.q4.ymax):
				inst = MOVE_LEFT
			elif (center.x >= self.q5.xmin and center.x < self.q5.xmax) and (center.y >= self.q5.ymin and center.y < self.q5.ymax):
				inst = STAY_STILL
			elif (center.x >= self.q6.xmin and center.x < self.q6.xmax) and (center.y >= self.q6.ymin and center.y <= self.q6.ymax):
				inst = MOVE_RIGHT
			elif (center.x >= self.q7.xmin and center.x <= self.q7.xmax) and (center.y >= self.q7.ymin and center.y < self.q7.ymax):
				inst = MOVE_BOTTOM_LEFT
			elif (center.x >= self.q8.xmin and center.x <= self.q8.xmax) and (center.y >= self.q8.ymin and center.y < self.q8.ymax):
				inst = MOVE_BACKWARD
			elif (center.x >= self.q9.xmin and center.x <= self.q9.xmax) and (center.y >= self.q9.ymin and center.y <= self.q9.ymax):
				inst = MOVE_BOTTOM_RIGHT		
		self.previous_insts.append([inst, score])
		return inst

	def history_based_decision(self):
		den = len(self.previous_insts)
		#unique_insts = list(set(self.previous_insts))
		count_dict = {}
		for inst in self.previous_insts:
			if inst[0] not in count_dict:
				count_dict[inst[0]] = [1, inst[1]]
			else:
				count_dict[inst[0]][0] += 1
				count_dict[inst[0]][1] += inst[1]
		return sorted(count_dict.items(), key=lambda x: x[1][0]*x[1][1], reverse=True)[0][0]


class point:
		def __init__(self, x, y):
			self.x = x
			self.y = y


class quadrant:
		def __init__(self, xmin, ymin, xmax, ymax):
			self.xmin = xmin
			self.ymin = ymin
			self.xmax = xmax
			self.ymax = ymax

