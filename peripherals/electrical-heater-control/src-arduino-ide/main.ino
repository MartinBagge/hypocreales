#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const int HEATER_PIN = 28;
const int PUMP_PIN = 27;

const char* ssid = "";
const char* password = "";
StaticJsonDocument<64> stateDoc;

char MAC[20];

int current_hour;
int heartbeat;

void macToString(uint8_t mac[6]) {
  static char s[20];
  sprintf(s, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  strlwr(s);
  strcpy(MAC, s);
  //Serial.println("MAC:");
  //Serial.println(MAC);
}

void setup_mac() {
  byte mac[6];
  WiFi.macAddress(mac);
  macToString(mac);
}

void setup_wifi() {
  WiFi.mode(WIFI_STA);
  // Start WiFi with supplied parameters
  WiFi.begin(ssid, password);
  // Print periods on monitor while establishing connection
  while (WiFi.status() != WL_CONNECTED) {
    WiFi.disconnect();
    delay(10000);
  }
  //Serial.println("wifi connected");
}

void setup_pins() {
  pinMode(HEATER_PIN, OUTPUT);
}

void setup_variables() {
  current_hour = 0;
  heartbeat = 0;
}

void setup() {
  //Serial.begin(115200);
  setup_wifi();
  setup_mac();
  setup_pins();
  setup_variables();
}

void heater_start() {
  digitalWrite(HEATER_PIN, HIGH);
  //Serial.println("Heater started");
}

void heater_stop() {
  digitalWrite(HEATER_PIN, LOW);
  //Serial.println("Heater stopped");
}

void pump_start() {
  digitalWrite(PUMP_PIN, HIGH);
}

void pump_stop() {
  digitalWrite(PUMP_PIN, LOW);
}

void send_log(char* msg, int code) {
  HTTPClient https;
  https.setInsecure();
  https.begin("https://udgaard.hypocreales.dk/log/heartbeat");
  https.addHeader("Content-Type", "application/json");
  // start connection and send HTTP header and body
  char s[256];
  sprintf(s, "{\"mac\":\"%s\",\"status_code\":\"%u\",\"msg\":\"%s\"}", MAC, code, msg);
  //Serial.println(s);
  int retry_counter = 0;
  int httpCode = https.POST(s);
  while(httpCode <= 0 && retry_counter <= 5){
        delay(1000);
        //Serial.println("Retrying log send");
        char num[4];
        itoa(httpCode, num, 10);
        //Serial.println(num);
        httpCode = https.GET();
        retry_counter++;
      }
  https.end();
  //Serial.println("log posted");
}

void api_check() {
  String base("https://udgaard.hypocreales.dk/activate/hexmac/");
  String mac(MAC);
  String surl = base + MAC;
  //Serial.println(surl.c_str());
  int loop_counter = 0;
  int retry_counter = 0;
  while (true) {
    HTTPClient https;
    https.setInsecure();
    if (https.begin(surl)) {  // HTTPS
      // start connection and send HTTP header
      int httpCode = https.GET();
      // httpCode will be negative on error
      while(httpCode <= 0 && retry_counter <= 5){
        delay(10000);
        //Serial.println("Retrying api");
        char num[4];
        itoa(httpCode, num, 10);
        //Serial.println(num);
        httpCode = https.GET();
        retry_counter++;
      }
      if (httpCode > 0) {
        //Serial.println("api_here_1");
        // file found at server
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          //Serial.println("api_here_2");
          String payload = https.getString();
          DeserializationError error = deserializeJson(stateDoc, payload.c_str(), 64);
          if (error) {
            char msg[16];
            char base[] = "deserialization fail";
            char num[4];
            itoa(loop_counter, num, 10);
            strcpy(msg, base);
            strcat(msg, num);
            send_log(msg, 0);
          }
          const char* state_heater = stateDoc["heater"];
          const char *state_pump = stateDoc["pump"];

          if (strcmp(state_heater, "start") == 0) {
            heater_start();
            char msg[] = "heater started";
            send_log(msg, 1);
            if (strcmp(state_pump, "start") == 0) {
              pump_start();
              char msg[] = "pump started";
              send_log(msg, 1);
            }
            else {
              pump_stop();
              char msg[] = "pump stopped";
              send_log(msg, 1);
            }
            https.end();
            return;
          } else {
            heater_stop();
            char msg[] = "heater stopped";
            send_log(msg, 1);
            https.end();
            return;
          }
        } else {
          char msg[16];
          char base[] = "api fail";
          char num[4];
          itoa(loop_counter, num, 10);
          strcpy(msg, base);
          strcat(msg, num);
          send_log(msg, 0);
        }
      }
    }
    https.end();
    if (loop_counter >= 5) {
      return;
    }
    loop_counter++;
    delay(1000);
  }
}

int get_hour() {
  HTTPClient https;
  https.setInsecure();
  const size_t capacity = JSON_OBJECT_SIZE(15) + 390;
  DynamicJsonDocument jsonBuffer(capacity);
  String hour = "-1";
  int retry_counter = 0;
  if (https.begin("https://worldtimeapi.org/api/timezone/Europe/Berlin")) {  // HTTPS
    // start connection and send HTTP header
    int httpCode = https.GET();
     while(httpCode <= 0 && retry_counter <= 5){
        delay(1000);
        //Serial.println("Retrying hour");
        httpCode = https.GET();
        retry_counter++;
      }
    // httpCode will be negative on error
    if (httpCode > 0) {
      // file found at server
      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
        String payload = https.getString();
        DeserializationError error = deserializeJson(jsonBuffer, payload.c_str(), capacity);
        if (error) {
          return -1;
        }
        const char* datetime_c = jsonBuffer["datetime"];
        String datetime = String(datetime_c);
        int index = datetime.indexOf('T');
        String str = datetime.substring(index + 1);
        index = str.indexOf(':');
        hour = str.substring(0, index);
        //Serial.println("hour:");
        //Serial.println(hour);
      }
      https.end();
    }
  }
  return hour.toInt();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    setup_wifi();
  }
  int hour = get_hour();
  if (hour == -1) {
    char msg[] = "failed to get hour";
    send_log(msg, 0);
  } else {
    //Serial.println("API check");
    //api_check();
    if (hour > current_hour || (current_hour == 23 && hour == 0)) {
      api_check();
      current_hour = hour;
    }
  }
  if (heartbeat == 6) {
    heartbeat = 0;
    char msg[] = "heartbeat";
    send_log(msg, 2);
  } else {
    heartbeat++;
  }
  delay(1000 * 60 * 5);
}
