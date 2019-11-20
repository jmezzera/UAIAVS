import requests
from time import sleep
from DecisionMaker import instruction

class connectionHandler:
    def __init__(self, url):
        self.url = url
       	self.prev_inst = instruction(0, 0, 0)

    def run(self, Inst, threadLockInst):
        while True:
            threadLockInst.acquire()
            inst = Inst.inst
            if inst != None:
                if inst != self.prev_inst:
                	sleep(0.1)
                	print("Starting post: ("+str(inst.x)+" , "+str(inst.y)+" , "+ str(inst.z)+" , "+ str(inst.speed)+")")
                	body = '{"x":' + str(inst.x*3) + ',"y":' + str(inst.y*3) + ',"z":' + str(inst.z*3) + ',"speed":' + str(inst.speed) +'}'
                	r = requests.post(self.url, data=body, headers={"content-type": "application/json"})
                	#print("finished post with status" + str(r.status_code))
                	print("ENVIO INSTRUCCION")
                	self.prev_inst = inst
            threadLockInst.release()
            sleep(0.1)
