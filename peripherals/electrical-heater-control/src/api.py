# micropython
import urequests
import network
import ubinascii
import gpio

#API_KEY: Optional[str] = os.environ.get("API_KEY")
MAC = ubinascii.hexlify(network.WLAN().config('mac'),':').decode()

def check_activate() -> None:
    res = urequests.get("https://udgaard.hypocreales.dk/activate/hexmac/"+MAC)
    if 200 <= res.status_code < 300:
        if res.json()["state"] == "start":
            gpio.activate_heater()
            urequests.post("https://udgaard.hypocreales.dk/log/heartbeat", json={"mac": MAC, "status_code": 1, "msg": "heater started"}, headers={'Content-Type':'application/json'})
        else:
            gpio.deactivate_heater()
            urequests.post("https://udgaard.hypocreales.dk/log/heartbeat", json={"mac": MAC, "status_code": 1, "msg": "heater stopped"}, headers={'Content-Type':'application/json'})
    else:
        urequests.post("https://udgaard.hypocreales.dk/log/heartbeat", json={"mac": MAC, "status_code": 0, "msg": "api misbehaved"}, headers={'Content-Type':'application/json'})

