# micropython
import machine


HEATER_PIN: int = 18
FAN_PIN: int = 0

FAN = machine.Pin(FAN_PIN, machine.Pin.OUT)
HEATER = machine.Pin(HEATER_PIN, machine.Pin.OUT)


def activate_heater() -> None:
    FAN.value(1)
    HEATER.value(1)


def deactivate_heater() -> None:
    FAN.value(0)
    HEATER.value(0)
