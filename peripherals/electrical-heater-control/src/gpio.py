# Raspberry pi
import RPi.GPIO as GPIO


HEATER_PIN: int = 18
FAN_PIN: int = 0

GPIO.setmode(GPIO.BOARD)
GPIO.setup(FAN_PIN, GPIO.OUT)
GPIO.setup(HEATER_PIN, GPIO.OUT)


def activate_heater() -> None:
    GPIO.output(HEATER_PIN, GPIO.HIGH)
    GPIO.output(FAN_PIN, GPIO.HIGH)


def deactivate_heater() -> None:
    GPIO.output(HEATER_PIN, GPIO.low)
    GPIO.output(FAN_PIN, GPIO.low)
