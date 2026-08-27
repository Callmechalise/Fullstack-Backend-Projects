#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>



#define dhtpin 15
#define dhttype DHT11

DHT dht(dhtpin,dhttype);

const char* ssid = "Chalise network";
const char* password = "i do not know";

const char* serverUrl = "http://192.168.1.149:8000/sensor";



void setup()
{
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);

  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected!");
}

void loop()
{
  float humidity=dht.readHumidity();
  float temperature=dht.readTemperature();
  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;

    http.begin(serverUrl);

    // Tell backend we are sending JSON
    http.addHeader("Content-Type", "application/json");

    // Create JSON
    JsonDocument doc;

    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    doc["heart_rate"] = "0";

    String json;

    serializeJson(doc, json);

    // POST request
    int responseCode = http.POST(json);

    Serial.print("Response Code: ");
    Serial.println(responseCode);

    if (responseCode > 0) {
      String response = http.getString();
      Serial.println(response);
    } else {
      Serial.println("Request failed");
    }

    http.end();
  }

  
}