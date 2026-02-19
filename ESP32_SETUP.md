# ESP32 Setup Guide

## Quick Start

### Prerequisites
- ESP32 Board
- USB Cable
- Arduino IDE installed
- ArduinoJson library installed

### Step 1: Update WiFi Credentials

Open `gravity_meter.ino` and find these lines:

```cpp
const char* ssid = "YOUR_SSID";          // Replace with your WiFi name
const char* password = "YOUR_PASSWORD";  // Replace with your WiFi password
```

Replace with your actual WiFi credentials.

### Step 2: Configure Pins

The default configuration is:
- **GPIO 34** - Soil Moisture Sensor (analog input)
- **GPIO 26** - Pump relay control (digital output)
- **GPIO 2** - Blue LED WiFi indicator (digital output)

If you're using different pins, update these lines:

```cpp
const int SOIL_MOISTURE_PIN = 34;   // Change if needed
const int PUMP_PIN = 26;             // Change if needed
const int BLUE_LED_PIN = 2;          // Change if needed
```

### Step 3: Upload Code

1. Connect ESP32 to computer via USB
2. In Arduino IDE:
   - Select **Tools** → **Board** → **ESP32 Dev Module**
   - Select your COM port
   - Click **Upload**

### Step 4: Verify Connection

1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 115200
3. Press ESP32 reset button
4. You should see:
   ```
   Starting Gravity Meter ESP32...
   Connecting to WiFi: YOUR_SSID
   WiFi connected! IP address: 192.168.1.XXX
   HTTP Server started on port 8080
   ```

### Step 5: Find ESP32 IP Address

Write down the IP address shown in Serial Monitor.
You'll need this for the Next.js `.env.local` file.

### Step 6: Test REST API

Open your browser and visit:
`http://192.168.1.XXX:8080/`

You should see the ESP32 status page with moisture level and pump control.

## API Testing

### Get Moisture Status

```bash
curl http://192.168.1.XXX:8080/status
```

Response:
```json
{
  "moisture": 65,
  "pumping": false,
  "rawSensor": 2048,
  "timestamp": 12345,
  "temperature": 22.5
}
```

### Activate Pump

```bash
curl -X POST http://192.168.1.XXX:8080/water \
  -H "Content-Type: application/json" \
  -d '{"duration": 3000}'
```

Response:
```json
{
  "success": true,
  "message": "Pump activated",
  "duration": 3000,
  "timestamp": 12345
}
```

## Sensor Calibration

The soil moisture sensor needs calibration for accurate readings.

### Calibration Steps:

1. **Read Dry Value**
   - Let sensor dry completely
   - Open Serial Monitor
   - Note the "Raw Sensor" value
   - Example: `4095`

2. **Read Wet Value**
   - Submerge sensor in water
   - Note the "Raw Sensor" value
   - Example: `0`

3. **Update Arduino Code**
   ```cpp
   // In updateMoistureReading() function:
   int rawMin = 0;      // Your wet value
   int rawMax = 4095;   // Your dry value
   currentMoisture = map(rawValue, rawMin, rawMax, 100, 0);
   ```

4. **Reupload**
   - Save changes
   - Upload to ESP32
   - Test with actual soil

## Troubleshooting

### Serial Output Shows Garbage
- Check baud rate is 115200
- Verify USB cable is working
- Try different USB port

### Can't Connect to WiFi
- Confirm SSID and password are correct
- Check WiFi 2.4GHz (not 5GHz)
- Ensure WiFi isn't using special characters
- Restart ESP32

### Sensor Always Reads 0 or 100
- Check ADC pin connection
- Recalibrate sensor
- Verify GPIO 34 is configured as input

### Pump Doesn't Turn On
- Check GPIO 26 wiring
- Verify relay/MOSFET is powered
- Test relay independently
- Check pump power supply

## Common Issues

**Issue:** Serial Monitor shows "brownout detector was triggered"
**Solution:** Provide adequate power supply (better USB power or external 5V)

**Issue:** Board disconnects when pump activates
**Solution:** Pump causes voltage drop - add capacitor or separate power supply

**Issue:** WiFi connects but disconnects after a few seconds
**Solution:** Reduce WiFi interference or move router closer

## Next Steps

1. Note ESP32 IP address from Serial Monitor
2. Copy `.env.local.example` to `.env.local`
3. Update ESP32 IP in `.env.local`
4. Start Dashboard with `npm run dev`
5. Open http://localhost:3000 in browser
