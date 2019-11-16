import requests
from time import sleep

class connectionHandler:
    def __init__(self, url):
        self.url = url
       	self.prev_inst = (0, 0, 0)

    def run(self, Inst, threadLockInst):
        while True:
            threadLockInst.acquire()
            inst = Inst.inst
            if inst != None:
                if inst != self.prev_inst:
                	sleep(0.1)
                	print("Starting post:"+str(inst))
                	body = '{"x":' + str(inst[0]*3) + ',"y":' + str(inst[1]*3) + ',"z":' + str(inst[2]*3) + ',"time": 0.2}'
                	r = requests.post(self.url, data=body, headers={"content-type": "application/json"})
                	#print("finished post with status" + str(r.status_code))
                	print("ENVIO INSTRUCCION")
                	self.prev_inst = inst
            threadLockInst.release()
            sleep(0.1)
