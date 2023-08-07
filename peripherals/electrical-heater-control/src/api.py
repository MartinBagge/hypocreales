# micropython
import urequests
import network
import ubinascii
import gpio

#API_KEY: Optional[str] = os.environ.get("API_KEY")
MAC = ubinascii.hexlify(network.WLAN().config('mac'),':').decode()

# WIFI setup
wlan = network.WLAN(network.STA_IF)
wlan.active(True)

# Fill in your network name (ssid) and password here:
ssid = ""
password = ""
wlan.connect(ssid, password)


def check_activate() -> None:
    res = urequests.get(
        f"https://udgaard.hypocreales.dk/activate/hexmac/{MAC}",
        #headers={"API_KEY": API_KEY if API_KEY else ""},
    )
    if 200 >= res.status_code < 300:
        if res.json()["state"] == "start":
            gpio.activate_heater()
        else:
            gpio.deactivate_heater()
