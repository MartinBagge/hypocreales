import requests
import os
import uuid
import gpio
from typing import Optional

API_KEY: Optional[str] = os.environ.get("API_KEY")


def check_activate() -> None:
    res = requests.get(
        f"https://udgaard.hypocreales.dk/activate/hexmac/{hex(uuid.getnode())}",
        headers={"API_KEY": API_KEY if API_KEY else ""},
    )
    if 200 >= res.status_code < 300:
        if res.json()["state"] == "start":
            gpio.activate_heater()
        else:
            gpio.deactivate_heater()
