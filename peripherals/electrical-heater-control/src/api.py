# micropython
import upip
upip.install("urequests")
import urequests
upip.install("network")
import network
import gpio

#API_KEY: Optional[str] = os.environ.get("API_KEY")
MAC = hex(network.WLAN().mac())


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
