import time
import api
import datetime


def main():
    while True:
        api.check_activate()
        now = datetime.datetime.now()
        new = datetime.datetime(now.year, now.month, now.day, now.hour + 1, 1)
        print(now)
        print(now.hour)
        time.sleep(5)#(new - now).total_seconds())

main()
