import time
import network
import urequests
import api

wlan = network.WLAN(network.STA_IF)
wlan.active(True)

def init():
    # Fill in your network name (ssid) and password here:
    ssid = ""
    password = ""
    wlan.connect(ssid, password)
    #timeout to let the wifi chip connect before network calls
    time.sleep(30)
    if wlan.isconnected():
        urequests.post("https://udgaard.hypocreales.dk/log/heartbeat", json={"mac": api.MAC, "status_code": 1, "msg": "wifi connected"}, headers={'Content-Type':'application/json'})
    else:
        urequests.post("https://udgaard.hypocreales.dk/log/heartbeat", json={"mac": api.MAC, "status_code": 0, "msg": "wifi missing"}, headers={'Content-Type':'application/json'})

def main():
    init()
    current_hour = 0
    while True:
        if not wlan.isconnected():
            init()
        now = urequests.get("http://worldtimeapi.org/api/timezone/Europe/Berlin")
        now = now.json()["datetime"]
        times = now.split("T")
        hour = int(times[1].split(":")[0])
        if hour > current_hour or (current_hour == 23 and hour == 0):
            api.check_activate()
            current_hour = hour
        time.sleep(60)

#in case of power outage, let the router start first
time.sleep(60*5)
main()
