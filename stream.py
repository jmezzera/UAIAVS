import time
import socket
import urllib.request
# import json
import re
from goprocam import constants
import datetime
import struct
import subprocess
from socket import timeout
from urllib.error import HTTPError
from urllib.error import URLError
import http
import math
import base64
import sys
import ssl


class GoProCamera:

    def __init__(self):
        self.ip_addr = "10.5.5.9"

    def stream(self, addr, quality=""):
        """Starts a FFmpeg instance for streaming to an address
        addr: Address to stream to
        quality: high/medium/low
        """
        self.livestream("start")
        if quality == "high":
            self.streamSettings("4000000", "7")
        elif quality == "medium":
            self.streamSettings("1000000", "4")
        elif quality == "low":
            self.streamSettings("250000", "0")
        subprocess.Popen("ffmpeg -f mpegts -i udp://" +
                            ":8554 -b 400k -r 30 -f mpegts " + addr, shell=True)

        time.sleep(60)
        self.KeepAlive()

    def livestream(self, option):
        """start livestreaming
        option = "start"/"stop"
        """
        if option == "start":
            return self.gpControlExecute(
                "p1=gpStream&a1=proto_v2&c1=restart")
        if option == "stop":
            return self.gpControlExecute("p1=gpStream&a1=proto_v2&c1=stop")

    def KeepAlive(self):
        """Sends keep alive packet"""
        while True:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.sendto("_GPHD_:0:0:2:0.000000\n".encode(),
                        (self.ip_addr, 8554))
            time.sleep(2500/1000)

    def streamSettings(self, bitrate, resolution):
        """Sets stream settings"""
        self.gpControlSet("62", bitrate)
        self.gpControlSet("64", resolution)

    def gpControlSet(self, param, value):
        """sends Parameter and value to gpControl/setting"""
        try:
            return self._request("gp/gpControl/setting", param, value)
        except (HTTPError, URLError) as error:
            return error
        except timeout:
            return error

    def gpControlExecute(self, param):
        """sends Parameter to gpControl/execute"""
        try:
            return self._request("gp/gpControl/execute?" + param)
        except (HTTPError, URLError) as error:
            return ""
        except timeout:
            return ""

    def _request(self, path, param="", value="", _timeout=5, _isHTTPS=False, _context=None):
        if param != "" and value == "":
            uri = "%s%s/%s/%s" % ("https://" if _isHTTPS else "http://",
                                    self.ip_addr, path, param)
            return urllib.request.urlopen(uri, timeout=_timeout, context=_context).read().decode("utf-8")
        elif param != "" and value != "":
            uri = "%s%s/%s/%s/%s" % ("https://" if _isHTTPS else "http://",
                                        self.ip_addr, path, param, value)
            return urllib.request.urlopen(uri, timeout=_timeout, context=_context).read().decode("utf-8")
        elif param == "" and value == "":
            uri = "%s%s/%s" % ("https://" if _isHTTPS else "http://",
                                self.ip_addr, path)
            return urllib.request.urlopen(uri, timeout=_timeout, context=_context).read().decode("utf-8")