# 🚀 Quick Reference Card

## Gravity Meter Dashboard - At a Glance

### 🎯 What This Does
- Real-time web dashboard for soil moisture monitoring  
- Icon falls as soil dries, floats up when watered  
- One-click pump control via web button  
- Connects ESP32 microcontroller to your plants  

---

## ⚡ 3-Step Setup

### 1️⃣ Install Node.js
```
nodejs.org → Download → Install
```

### 2️⃣ Install & Run
```bash
npm install
npm run dev
# Open: http://localhost:3000
```

### 3️⃣ Upload ESP32
```
Arduino IDE → Set WiFi info → Upload → Note IP address
Update .env.local with IP → Refresh browser
```

---

## 📝 File Locations

| What | Where |
|-----|-------|
| Dashboard UI | `components/GravityMeter.tsx` |
| API Routes | `app/api/` |
| ESP32 Code | `esp32-firmware/gravity_meter.ino` |
| Config | `.env.local` |
| Docs | `README.md`, `GETTING_STARTED.md` |

---

## 🔌 Hardware Pins

```
ESP32 GPIO 34  → Soil Moisture Sensor (ADC)
ESP32 GPIO 26  → Pump Relay Control
ESP32 GPIO 2   → WiFi Status LED
```

---

## 🌐 API Endpoints

### Get Soil Status
```
GET /api/soil-status
Response: { moisture: 0-100, isPumping: bool }
```

### Water Plant
```
POST /api/water
Response: { success: bool, message: string }
```

---

## 🔧 Configuration

### .env.local
```env
NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
ESP32_IP=http://192.168.1.XXX:8080
```

### Arduino (gravity_meter.ino)
```cpp
const char* ssid = "YourWiFi";
const char* password = "YourPassword";
const int SOIL_MOISTURE_PIN = 34;
const int PUMP_PIN = 26;
const int BLUE_LED_PIN = 2;
```

---

## 📊 Real-Time Flow

```
Dashboard polls every 2 seconds
   ↓
GET /api/soil-status
   ↓
Next.js API queries ESP32:8080/status
   ↓
ESP32 reads ADC pin + relay status
   ↓
Response returned → UI updates → Icon moves
```

---

## 🎮 User Actions

| Action | What Happens |
|--------|--------------|
| Page loads | Starts polling ESP32 every 2s |
| Moisture increases | Icon floats up |
| Moisture decreases | Icon falls down |
| Click "Water" | Pump activates for 3 seconds |

---

## 🐛 Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| "Cannot reach ESP32" | Check IP in `.env.local` |
| Sensor always same value | Check GPIO 34 wiring |
| Pump won't run | Check GPIO 26 wiring and relay power |
| WiFi disconnect | Move ESP32 closer to router |

---

## 📚 Documentation

- **GETTING_STARTED.md** - 5-minute quick start
- **README.md** - Full feature guide  
- **ARCHITECTURE.md** - How everything works
- **HARDWARE_WIRING.md** - Wiring diagrams
- **ESP32_SETUP.md** - Arduino setup steps
- **DEPLOYMENT.md** - Cloud deployment

---

## ✨ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript |
| Framework | Next.js 14 |
| Styling | Tailwind CSS |
| Backend | Node.js API Routes |
| Hardware | ESP32 + Arduino |
| Communication | WiFi + HTTP |

---

## 🎯 Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm lint             # Check code quality

# Typical workflow
npm install          # One time setup
npm run dev          # Start development
# Make changes...
# Test in browser
npm run build        # When ready to deploy
```

---

## 🔐 Security Checklist

- [ ] WiFi password set in ESP32 code
- [ ] `.env.local` NOT committed to git
- [ ] HTTPS used if on public internet
- [ ] API authentication added (if needed)
- [ ] No credentials in logs

---

## 🚀 Expansion Ideas

- [ ] Add second moisture sensor
- [ ] Automatic watering schedule
- [ ] Temperature/humidity monitoring
- [ ] Historical data graphs
- [ ] Mobile app version
- [ ] Home Assistant integration

---

## 📞 Key URLs

| Purpose | URL |
|---------|-----|
| Dashboard (dev) | http://localhost:3000 |
| ESP32 web page | http://192.168.1.XXX:8080 |
| ESP32 API status | http://192.168.1.XXX:8080/status |
| ESP32 API water | http://192.168.1.XXX:8080/water |

---

## 💡 Pro Tips

1. **Test without water button** → Open browser to ESP32 IP directly
2. **Mock data works offline** → Dashboard shows data even without ESP32
3. **Serial monitor is your friend** → Check ESP32 logs for debugging
4. **Calibrate sensor first** → Wet/dry values determine accuracy
5. **Keep URL handy** → Bookmark ESP32 IP page for quick access

---

## 📋 Pre-Launch Checklist

- [ ] Node.js installed (`node --version` shows v18+)
- [ ] Project dependencies installed (`npm install` success)
- [ ] Arduino IDE installed
- [ ] ESP32 board support added
- [ ] ArduinoJson library installed
- [ ] ESP32 code uploaded successfully
- [ ] `.env.local` configured with ESP32 IP
- [ ] `npm run dev` starts without errors
- [ ] Dashboard loads at http://localhost:3000
- [ ] "Water Now" button works
- [ ] Icon animation visible

---

## 🎉 You're All Set!

Everything is ready to go. Just:
1. Install Node.js
2. Run `npm install`
3. Upload ESP32 code
4. Configure IP in `.env.local`
5. Start `npm run dev`

Your gravity meter is ready! 💧✨

---

**Keep this card handy for quick reference!**
Print it, save it, or bookmark it.

Need help? Check the docs or the troubleshooting sections.


// test