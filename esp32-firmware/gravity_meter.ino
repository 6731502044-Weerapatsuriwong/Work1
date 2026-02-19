#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_SSID";          // Replace with your WiFi SSID
const char* password = "YOUR_PASSWORD";  // Replace with your WiFi password

// Pin Configuration
const int SOIL_MOISTURE_PIN = 34;        // Analog pin for soil moisture sensor (ADC)
const int PUMP_PIN = 26;                 // Digital pin for pump relay (or LED)
const int BLUE_LED_PIN = 2;              // Digital pin for blue LED indicator

// Web Server (port 8080)
WebServer server(8080);

// State Variables
unsigned long pumpStartTime = 0;
bool pumpActive = false;
int currentMoisture = 50;

// Constants
const int ADC_MAX = 4095;              // ESP32 ADC max value
const int DRY_THRESHOLD = 30;          // Moisture level below which soil is considered dry
const int WET_THRESHOLD = 80;          // Moisture level above which soil is considered wet

// Function prototypes
void setupWiFi();
void setupPins();
void updateMoistureReading();
void updatePumpState();
void handleStatus();
void handleWater();
void handleRoot();

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\nStarting Gravity Meter ESP32...");
  
  setupPins();
  setupWiFi();
  
  // Setup web server routes
  server.on("/", handleRoot);
  server.on("/status", handleStatus);
  server.on("/water", HTTP_POST, handleWater);
  
  server.begin();
  Serial.println("HTTP Server started on port 8080");
  
  // Initial moisture reading
  updateMoistureReading();
}

void loop() {
  server.handleClient();
  updateMoistureReading();
  updatePumpState();
  delay(100);
}

// WiFi Setup
void setupWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("WiFi connected! IP address: ");
    Serial.println(WiFi.localIP());
    
    // Turn on blue LED to indicate WiFi connection
    digitalWrite(BLUE_LED_PIN, HIGH);
  } else {
    Serial.println("Failed to connect to WiFi");
    // Blink LED to indicate WiFi error
    digitalWrite(BLUE_LED_PIN, LOW);
  }
}

// Pin Setup
void setupPins() {
  pinMode(PUMP_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(SOIL_MOISTURE_PIN, INPUT);
  
  // Ensure pump is off initially
  digitalWrite(PUMP_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);
}

// Read soil moisture sensor and update current moisture
void updateMoistureReading() {
  int rawValue = analogRead(SOIL_MOISTURE_PIN);
  
  // Convert raw ADC value to percentage (0-100)
  // Assume: rawValue = 4095 is completely dry (0%)
  //         rawValue = 0 is completely wet (100%)
  // You may need to calibrate these values based on your sensor
  currentMoisture = map(rawValue, 4095, 0, 0, 100);
  currentMoisture = constrain(currentMoisture, 0, 100);
}

// Update pump state (turn off if duration exceeded)
void updatePumpState() {
  if (pumpActive) {
    unsigned long elapsedTime = millis() - pumpStartTime;
    
    // Check if pump should be turned off
    if (elapsedTime > 3000) { // 3 second default pump duration
      digitalWrite(PUMP_PIN, LOW);
      Serial.println("Pump turned off (duration exceeded)");
      pumpActive = false;
    }
  }
}

// HTTP Handler: GET /status
void handleStatus() {
  DynamicJsonDocument doc(200);
  
  doc["moisture"] = currentMoisture;
  doc["pumping"] = pumpActive;
  doc["rawSensor"] = analogRead(SOIL_MOISTURE_PIN);
  doc["timestamp"] = millis();
  doc["temperature"] = 22.5; // Placeholder - add temperature sensor if needed
  
  String response;
  serializeJson(doc, response);
  
  server.sendHeader("Content-Type", "application/json");
  server.send(200, "application/json", response);
  
  Serial.print("Status requested. Moisture: ");
  Serial.print(currentMoisture);
  Serial.print("%, Pump: ");
  Serial.println(pumpActive ? "ON" : "OFF");
}

// HTTP Handler: POST /water
void handleWater() {
  // Parse optional duration from request body
  int pumpDuration = 3000; // Default 3 seconds
  
  if (server.hasArg("plain")) {
    String requestBody = server.arg("plain");
    DynamicJsonDocument doc(200);
    deserializeJson(doc, requestBody);
    
    if (doc.containsKey("duration")) {
      pumpDuration = doc["duration"];
    }
  }
  
  // Activate pump
  digitalWrite(PUMP_PIN, HIGH);
  pumpStartTime = millis();
  pumpActive = true;
  
  Serial.print("Pump activated for ");
  Serial.print(pumpDuration);
  Serial.println(" ms");
  
  // Send response
  DynamicJsonDocument response(200);
  response["success"] = true;
  response["message"] = "Pump activated";
  response["duration"] = pumpDuration;
  response["timestamp"] = millis();
  
  String responseStr;
  serializeJson(response, responseStr);
  
  server.sendHeader("Content-Type", "application/json");
  server.send(200, "application/json", responseStr);
}

// HTTP Handler: GET /
void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
    <title>Gravity Meter - ESP32</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 400px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
        }
        .status {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .status-item {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
        }
        .status-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        .status-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        button {
            background: #0066cc;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            width: 100%;
            transition: 0.3s;
        }
        button:hover {
            background: #0052a3;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .info {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 Gravity Meter</h1>
        <p>ESP32 Soil Moisture Monitor</p>
        
        <div class="status">
            <div class="status-item">
                <div class="status-label">Moisture Level</div>
                <div class="status-value" id="moisture">--</div>
            </div>
            <div class="status-item">
                <div class="status-label">Pump Status</div>
                <div class="status-value" id="pump-status">OFF</div>
            </div>
        </div>
        
        <button onclick="waterPlant()">💧 Water Plant</button>
        
        <div class="info">
            <p>✨ This is the ESP32 status page. The main dashboard is at <strong>http://YOUR_SERVER/</strong></p>
        </div>
    </div>
    
    <script>
        function updateStatus() {
            fetch('/status')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('moisture').textContent = data.moisture + '%';
                    document.getElementById('pump-status').textContent = data.pumping ? 'ON' : 'OFF';
                });
        }
        
        function waterPlant() {
            fetch('/water', { method: 'POST' })
                .then(r => r.json())
                .then(data => {
                    alert('Pump activated!');
                    updateStatus();
                });
        }
        
        setInterval(updateStatus, 2000);
        updateStatus();
    </script>
</body>
</html>
  )rawliteral";
  
  server.send(200, "text/html", html);
}
