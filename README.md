# Gravity Meter Dashboard

A Next.js web dashboard that monitors soil moisture using an ESP32 microcontroller. As soil dries out, an icon visually "falls" due to gravity. Click "Water Now" to activate the pump, and watch the icon float back up!

## Features

- ✨ **Real-time Soil Moisture Monitoring** - Visual gravity-based indicator
- 💧 **One-Click Watering** - Instantly activate pump from web dashboard
- 📊 **Live Status Updates** - Real-time moisture level display
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- 🔌 **ESP32 Integration** - WiFi-enabled microcontroller support
- 📱 **Mobile Responsive** - Works on all devices

## Project Structure

```
gravity-meter-dashboard/
├── app/
│   ├── api/
│   │   ├── soil-status/        # GET soil moisture data
│   │   └── water/              # POST water command
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── GravityMeter.tsx        # Main UI component
├── esp32-firmware/
│   └── gravity_meter.ino       # ESP32 Arduino code
├── public/                     # Static assets
├── package.json                # Dependencies
└── README.md                   # This file
```

## Prerequisites

1. **Node.js** (v18+) - [Download here](https://nodejs.org/)
2. **ESP32 Development Board** - ESP32-WROOM-32 recommended
3. **Arduino IDE** - [Download here](https://www.arduino.cc/en/software)
4. **USB Cable** - For programming ESP32

## Hardware Setup

### Components Needed

- ESP32 microcontroller
- Capacitive soil moisture sensor (analog output)
- Relay module or MOSFET (to control pump)
- Pump (12V recommended) or Blue LED for testing
- WiFi router with internet access
- USB power supply (5V for ESP32, 12V for pump)

### Wiring Diagram

```
ESP32 Pins:
├── GPIO 34 (ADC)    → Soil Moisture Sensor (analog output)
├── GPIO 26 (OUTPUT) → Relay/MOSFET → Pump
└── GPIO 2  (OUTPUT) → Blue LED (WiFi indicator)

Power:
├── ESP32: 5V USB or external 5V supply
└── Pump: 12V relay-controlled supply
```

### Pin Configuration

Edit `esp32-firmware/gravity_meter.ino`:

```cpp
const int SOIL_MOISTURE_PIN = 34;   // Analog pin
const int PUMP_PIN = 26;             // Digital pin
const int BLUE_LED_PIN = 2;          // Blue LED pin
```

## Web Dashboard Setup

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Configure ESP32 Connection

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
ESP32_IP=http://192.168.1.XXX:8080
```

Replace `192.168.1.XXX` with your ESP32's IP address.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Building for Production

```bash
npm run build
npm run start
```

## ESP32 Firmware Setup

### 1. Install Arduino IDE

Download and install [Arduino IDE](https://www.arduino.cc/en/software)

### 2. Install ESP32 Board Support

In Arduino IDE:
- **File** → **Preferences**
- Add this URL to "Additional Boards Manager URLs":
  ```
  https://dl.espressif.com/dl/package_esp32_index.json
  ```
- **Tools** → **Board Manager**
- Search for "ESP32" and install "esp32 by Espressif Systems"

### 3. Install Required Libraries

In Arduino IDE, go to **Sketch** → **Include Library** → **Manage Libraries**:

- Search for and install:
  - `ArduinoJson` by Benoit Blanchon
  - `WebServer` (usually built-in)
  - `WiFi` (usually built-in)

### 4. Configure WiFi

Edit `esp32-firmware/gravity_meter.ino`:

```cpp
const char* ssid = "YOUR_SSID";           // Your WiFi network name
const char* password = "YOUR_PASSWORD";   // Your WiFi password
```

### 5. Upload to ESP32

1. Connect ESP32 via USB
2. **Tools** → Select:
   - Board: "ESP32 Dev Module"
   - Port: Your COM port (e.g., COM3)
3. Click **Upload**
4. Open **Serial Monitor** (Tools → Serial Monitor) to verify

You should see output like:
```
Starting Gravity Meter ESP32...
Connecting to WiFi: YOUR_SSID
WiFi connected! IP address: 192.168.1.XXX
HTTP Server started on port 8080
```

## API Endpoints

### GET `/api/soil-status`

Returns current soil moisture and pump status.

**Response:**
```json
{
  "moisture": 65,
  "isPumping": false,
  "temperature": 22.5,
  "timestamp": "2024-02-19T10:30:00Z"
}
```

### POST `/api/water`

Activates the pump for a specified duration.

**Request Body (optional):**
```json
{
  "duration": 3000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pump activated successfully",
  "pumpDuration": 3000
}
```

## How It Works

1. **Moisture Monitoring**: The ESP32 reads the soil moisture sensor every 100ms
2. **Web Dashboard**: Next.js polls `/api/soil-status` every 2 seconds
3. **Visual Feedback**: The icon position represents moisture level (100% = top, 0% = bottom)
4. **Watering**: Clicking "Water Now" sends a POST request to `/api/water`
5. **Pump Control**: ESP32 activates the pump relay for 3 seconds
6. **Real-time Update**: Dashboard shows pump status and updated moisture readings

## Troubleshooting

### ESP32 Won't Connect to WiFi
- Verify SSID and password are correct
- Check WiFi router is in range
- Try restarting ESP32 (unplug and replug USB)

### Dashboard Can't Connect to ESP32
- Verify ESP32 IP address matches in `.env.local`
- Check both devices are on same WiFi network
- Ensure ESP32 HTTP server started (check serial monitor)
- Try accessing `http://ESP32_IP:8080/` directly in browser

### Sensor Readings Are Wrong
- Calibrate sensor: fully submerge in water and note raw value
- Dry sensor completely and note raw value
- Update ADC mapping in Arduino sketch

### Pump Not Activating
- Verify GPIO 26 is connected to relay properly
- Check relay is powered correctly
- Test relay manually with multimeter
- Check pump power supply

## Moisture Sensor Calibration

1. Insert sensor into soil
2. Read raw ADC value from serial monitor
3. Soak sensor in water, note wet ADC value
4. Let sensor dry completely, note dry ADC value
5. Update the ADC mapping in the Arduino sketch accordingly

## Environment Variables

`NEXT_PUBLIC_ESP32_IP` - ESP32 web server address (used by frontend)
`ESP32_IP` - ESP32 web server address (used by API routes)

## Future Enhancements

- [ ] Historical data logging and graphing
- [ ] Multiple plant monitoring
- [ ] Automated watering schedules
- [ ] Push notifications
- [ ] Mobile app
- [ ] Temperature and humidity monitoring
- [ ] Data export (CSV)

## License

MIT

## Support

For issues and questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)
- [Arduino IDE Guide](https://www.arduino.cc/en/Guide)
