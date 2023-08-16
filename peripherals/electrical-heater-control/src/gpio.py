# micropython
import machine


HEATER_PIN = "GP28"
#FAN_PIN: int = 0

#FAN = machine.Pin(FAN_PIN, machine.Pin.OUT)
HEATER = machine.Pin(HEATER_PIN, machine.Pin.OUT)
LED = machine.Pin("LED", machine.Pin.OUT)
LED.value(0)


def activate_heater() -> None:
    #FAN.value(1)
    print("activate")
    HEATER.value(1)
    LED.value(1)


def deactivate_heater() -> None:
    #FAN.value(0)
    print("deactivate")
    HEATER.value(0)
    LED.value(0)
