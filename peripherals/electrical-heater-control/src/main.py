import ntptime
import time
import api

def main():
    ntptime.host = "dk.pool.ntp.org"
    current_hour = 0
    while True:
        ntptime.settime()
        
        api.check_activate()
        now = time.localtime()
        if now[3] > current_hour or (current_hour == 23 and now[3] == 0):
            api.check_activate()
            current_hour = now[3]
        time.sleep(60*5)

main()
