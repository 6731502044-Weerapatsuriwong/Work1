# Getting Started - Quick Start Guide

Welcome to the Gravity Meter Dashboard! Follow this simple guide to get your system up and running.

## 🚀 5-Minute Quick Start

### 1. Install Node.js (One-time setup)

**Windows:**
1. Download: https://nodejs.org/
2. Run installer (select "Add to PATH")
3. Open PowerShell, verify: `node --version`

**Mac/Linux:**
```bash
curl -fsSL https://fnm.io/install | bash
fnm install --latest 18
```

### 2. Set Up the Web Dashboard

```bash
# Navigate to project folder
cd gravity-meter-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

You should see the Gravity Meter dashboard with a falling icon!

### 3. Set Up the ESP32 (Hardware)

**Quick Hardware Check:**
- [ ] ESP32 board
- [ ] Soil moisture sensor
- [ ] Relay or MOSFET for pump
- [ ] USB cable
- [ ] Pump (or blue LED for testing)

**Wire It Up** (see [HARDWARE_WIRING.md](HARDWARE_WIRING.md)):
```
ESP32 GPIO 34  ← Soil Sensor (analog)
ESP32 GPIO 26  ← Pump Relay (digital)
ESP32 GPIO 2   ← Blue LED (digital)
```

### 4. Upload ESP32 Code

1. Install Arduino IDE: https://www.arduino.cc/en/software
2. Install ESP32 board (File → Preferences → Add board URL)
3. Install ArduinoJson library
4. Edit `esp32-firmware/gravity_meter.ino`:
   ```cpp
   const char* ssid = "Your WiFi";
   const char* password = "Your Password";
   ```
5. Upload to ESP32 (Tools → Upload)
6. Open Serial Monitor to find ESP32 IP address

### 5. Connect Dashboard to ESP32

1. Copy `.env.local.example` to `.env.local`
2. Update ESP32 IP address:
   ```env
   NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
   ```
3. Refresh browser (http://localhost:3000)
4. Test: Click "Water Now" button

✅ **Done!** The icon should float up when you water!

---

## 📚 Full Setup (Detailed Steps)

### Complete Step-by-Step Guide

Follow these 10 steps in order:

#### Step 1: Install Node.js

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version  # Should be v18+
npm --version   # Should be v8+
```

**Windows:**
- Download LTS from https://nodejs.org/
- Run installer
- Keep defaults
- Restart computer
- Test: `node --version` in PowerShell

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

#### Step 2: Clone/Download Project

```bash
# If using git:
git clone https://github.com/your-username/gravity-meter-dashboard.git
cd gravity-meter-dashboard

# Or extract the .zip file you received
```

#### Step 3: Install Dependencies

```bash
npm install

# This downloads ~500MB and takes 2-5 minutes
# Coffee break! ☕
```

#### Step 4: Start Development Server

```bash
npm run dev

# Output should show:
# - Local: http://localhost:3000
# - Ready in 2.5s
```

Open http://localhost:3000 in your browser. You should see a dashboard with a falling icon!

#### Step 5: Install Arduino IDE

1. Download: https://www.arduino.cc/en/software
2. Run installer
3. Launch Arduino IDE

#### Step 6: Configure Arduino for ESP32

1. **File** → **Preferences**
2. Find "Additional Boards Manager URLs"
3. Paste: `https://dl.espressif.com/dl/package_esp32_index.json`
4. Click **OK**
5. **Tools** → **Board Manager**
6. Search "esp32"
7. Click install (ESP32 by Espressif Systems)
8. Close Board Manager

#### Step 7: Install Libraries

1. **Sketch** → **Include Library** → **Manage Libraries**
2. Search and install:
   - **ArduinoJson** (by Benoit Blanchon)
   - Version 6.x or 7.x
3. Click **Install**
4. Close Library Manager

#### Step 8: Configure & Upload ESP32 Code

1. Open `esp32-firmware/gravity_meter.ino` in Arduino IDE
2. Find these lines and edit:
   ```cpp
   const char* ssid = "YourWiFiNetwork";
   const char* password = "YourWiFiPassword";
   ```
3. **Tools** → Configure:
   - **Board**: "ESP32 Dev Module"
   - **Port**: Select your COM port (e.g., COM3)
4. **Sketch** → **Upload** (or Ctrl+U)
5. Wait for "Upload complete"

#### Step 9: Find ESP32 IP Address

1. **Tools** → **Serial Monitor**
2. Set baud to **115200** (bottom right)
3. Press ESP32 reset button
4. Look for: `WiFi connected! IP address: 192.168.1.XXX`
5. **Write down this IP address** ⭐

#### Step 10: Configure Dashboard

1. In VS Code, open `.env.local.example`
2. Copy its contents
3. **File** → **New File** → name it `.env.local`
4. Paste contents and update IP:
   ```env
   NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
   ESP32_IP=http://192.168.1.XXX:8080
   ```
5. Save file
6. Refresh browser (F5)

---

## ✅ Verification Checklist

Go through this checklist to verify everything works:

### Frontend
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads in browser
- [ ] Dashboard displays (with falling icon)
- [ ] Moisture meter shows percentage
- [ ] No console errors (F12 → Console tab)

### ESP32
- [ ] Arduino IDE uploads code successfully
- [ ] Serial Monitor shows WiFi connection message
- [ ] Blue LED on ESP32 lights up (WiFi connected)
- [ ] Can access http://192.168.1.XXX:8080 in browser
- [ ] ESP32 status page shows moisture reading

### Integration
- [ ] `.env.local` file exists with correct IP
- [ ] Dashboard moisture value changes every 2 seconds
- [ ] "Water Now" button is clickable
- [ ] Button click activates relay (hear click sound)
- [ ] Icon floats up after watering
- [ ] No errors in browser console

### Hardware
- [ ] Soil sensor connected to GPIO 34
- [ ] Pump relay connected to GPIO 26
- [ ] Blue LED connected to GPIO 2
- [ ] All grounds connected together
- [ ] No loose wires

---

## 🎮 Testing the System

### Test 1: Check Sensor Reading

1. Open Serial Monitor in Arduino IDE
2. Should see moisture value every second
3. **Wet sensor**: Value increases
4. **Dry sensor**: Value decreases

### Test 2: Check Pump Activation

1. Listen for relay click from esp32
2. Click "Water Now" on dashboard
3. Should hear relay clicking
4. Pump should start running

### Test 3: Check Dashboard Realtime

1. Water the plant with the button
2. Watch the icon float up
3. Check moisture percent increases
4. Wait for pump to stop (3 seconds)
5. Moisture should stabilize

---

## 🔧 Troubleshooting

### Dashboard shows "Failed to fetch"
**Causes:**
- ESP32 not connected to WiFi
- IP address in `.env.local` is wrong
- Firewall blocking connection

**Solutions:**
```bash
# 1. Verify ESP32 IP
#    Check Serial Monitor output

# 2. Test connection manually
ping 192.168.1.XXX

# 3. Try accessing directly
# Open browser: http://192.168.1.XXX:8080/status

# 4. Check .env.local is correct
cat .env.local
```

### "Can't find COM port"
**Solution:**
- Install CH340 driver: https://sparks.gogo.co.nz/ch340.html
- Or try different USB cable
- Plug into different USB port

### Sensor always shows high/low value
**Solutions:**
- Check sensor connections
- Wet and dry the sensor
- See sensor calibration guide

### Pump won't activate
**Causes:**
- GPIO 26 not connected to relay
- Relay not powered
- Pump power disconnected

**Test:**
1. Measure voltage at pump: should be 0V or 12V
2. Listen for relay click sound
3. Manually test pump with 12V supply

### WiFi keeps disconnecting
**Solutions:**
- Move ESP32 closer to router
- Check WiFi 2.4GHz (not 5GHz)
- Reduce interference (microwave nearby?)
- Try different WiFi band

---

## 📖 Next Steps

Once everything works:

1. **Read the documentation:**
   - [README.md](README.md) - Full feature list
   - [ARCHITECTURE.md](ARCHITECTURE.md) - How it works
   - [HARDWARE_WIRING.md](HARDWARE_WIRING.md) - Detailed wiring

2. **Calibrate your sensor:**
   - Follow sensor calibration in README.md
   - Adjust map() function in Arduino code

3. **Customize the dashboard:**
   - Edit colors in GravityMeter.tsx
   - Change pump duration
   - Add more features

4. **Deploy it:**
   - See DEPLOYMENT.md for options
   - Vercel (free tier available)
   - Docker container
   - Home server

---

## 🆘 Getting Help

1. **Check documentation** - Most answers are in README.md or ARCHITECTURE.md
2. **Console logs** - Open browser DevTools (F12) and check Console tab
3. **Serial Monitor** - Check ESP32 serial output for errors
4. **GitHub Issues** - Search existing issues or create new one

---

## 🎉 Success!

You now have a working gravity meter! 

**What you can do next:**
- Monitor plant moisture in real-time
- Water with one button click
- Watch the gravity simulation
- Expand to multiple plants
- Add automated watering schedule
- Deploy to the cloud

Happy watering! 💧✨
