#define BUZZER 4
#define VOLUME 250   // 50% of 8-bit range (0–255)
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ===== CONFIGURATION =====
const char* ssid = "Chalise network";
const char* password = "i do not know";

const char* serverName = "http://192.168.1.149:8000";

int checkForCommands() {
  if (WiFi.status() == WL_CONNECTED) 
  {
    HTTPClient http;
    http.begin(serverName + String("/on"));
    
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) 
    {
      String response = http.getString();
      Serial.print("📥 Command response: ");
      //Serial.println(response);
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, response);
      if (!error)
      {
          const char* message = doc["message"];
          Serial.print("✅ Message extracted: ");
          Serial.println(message);
          if(strcmp(message,"0")==0)
          {
            return 0;
          }
          else if (strcmp(message,"1")==0)
          {
            return 1;
          }
          else if(strcmp(message,"2")==0)
          {
            return 2;
          }
          else if(strcmp(message,"3")==0)
          {
            return 3;
          }
          else{
            return -1;
          }
      }
    }
  }
  return -1;
}

void setup() {
  Serial.begin(115200);
  ledcAttach(BUZZER, 2000, 8);
  Serial.print("📶 Connecting to WiFi");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

}

void tonePlay(int freq, int duration) {
  ledcWriteTone(BUZZER, freq);
  ledcWrite(BUZZER, VOLUME);
  delay(duration);
}

void soundOff() {
  ledcWriteTone(BUZZER, 0);
  ledcWrite(BUZZER, 0);
}

void beep(int freq, int duration) {
  tonePlay(freq, duration);
  soundOff();
}


// 1. Coin / reward
void coinSound() {
  tonePlay(988, 100);
  tonePlay(1319, 180);
  soundOff();
}


// 2. Level up
void levelUp() {
  int notes[] = {523, 659, 784, 1047, 1319};

  for (int i = 0; i < 5; i++) {
    tonePlay(notes[i], 120);
  }
  soundOff();
}


// 3. Error / sad sound
void failSound() {
  tonePlay(500, 150);
  tonePlay(400, 150);
  tonePlay(300, 350);
  soundOff();
}


// 4. Laser gun
void laser() {
  for (int f = 3000; f >= 200; f -= 40) {
    tonePlay(f, 5);
  }
  soundOff();
}


// 5. UFO / alien
void ufoSound() {
  for (int i = 0; i < 3; i++) {
    for (int f = 500; f < 2000; f += 30) {
      tonePlay(f, 5);
    }

    for (int f = 2000; f > 500; f -= 30) {
      tonePlay(f, 5);
    }
  }
  soundOff();
}


// 6. Police siren
void siren() {
  for (int i = 0; i < 3; i++) {

    for (int f = 600; f <= 1800; f += 25) {
      tonePlay(f, 5);
    }

    for (int f = 1800; f >= 600; f -= 25) {
      tonePlay(f, 5);
    }
  }
  soundOff();
}


// 7. Explosion
void explosion() {
  for (int f = 150; f < 2500; f += 50) {
    tonePlay(f, 4);
  }

  for (int f = 2500; f > 50; f -= 20) {
    tonePlay(f, 3);
  }

  soundOff();
}


// 8. Machine gun
void machineGun() {
  for (int i = 0; i < 12; i++) {
    tonePlay(1800, 40);
    soundOff();
    delay(30);
  }
}


// 9. Heartbeat
void heartbeat() {
  tonePlay(100, 80);
  soundOff();
  delay(80);

  tonePlay(80, 150);
  soundOff();
  delay(400);
}


// 10. Random arcade effect
void arcade() {
  for (int i = 0; i < 25; i++) {
    int f = random(300, 3000);
    tonePlay(f, random(30, 100));
  }
  soundOff();
}


void loop() {

static unsigned long lastCheck = 0;
  if (millis() - lastCheck > 5000) {
    lastCheck = millis();
    int x=checkForCommands();
    if(x==0)
    {
        arcade();
        Serial.print("\nX:");Serial.println(x);
    }
    else if(x==1)
    {   Serial.print("\nX:");Serial.println(x);
        laser();
    }
    else if(x==2)
    {   Serial.print("\nX:");Serial.println(x);
        coinSound();
    }
    else if(x==3)
    {   Serial.print("\nX:");Serial.println(x);
        machineGun();
    }
    else if(x==-1)
    { Serial.print("\nX:");Serial.println(x);
      Serial.print("no valid message comings");
    }
    else
    { Serial.print("\nX:");Serial.println(x);
      Serial.print("k naya vayo yo");
    }
  }
delay(100);
}