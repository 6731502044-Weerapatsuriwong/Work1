# 📂 Complete Project Structure Guide

## File Purpose Reference

### 🎯 Start Here
```
├── GETTING_STARTED.md ..................... 5-minute quick start guide
├── QUICK_REFERENCE.md .................... Handy reference card
└── README.md ............................. Full feature documentation
```

### 🧠 Understand the System
```
├── ARCHITECTURE.md ....................... System design & data flow
├── PROJECT_SUMMARY.md .................... Completion overview
└── DEPLOYMENT.md ......................... Deployment & scaling options
```

### ⚙️ Setup Hardware
```
├── HARDWARE_WIRING.md .................... Complete wiring diagrams
└── ESP32_SETUP.md ........................ Arduino configuration guide
```

### 💻 Frontend Code (React)
```
app/
├── page.tsx ............................. Home page (displays GravityMeter)
├── layout.tsx ........................... Root HTML layout
└── globals.css .......................... Global styles

components/
└── GravityMeter.tsx ..................... Main dashboard component
                                           - Falling/floating icon
                                           - Water button
                                           - Status display
                                           - API communication
```

### 🔌 Backend Code (Next.js API)
```
app/api/
├── soil-status/route.ts ................. GET /api/soil-status
│                                         - Fetches moisture from ESP32
│                                         - Returns JSON with moisture %
│
└── water/route.ts ....................... POST /api/water
                                          - Activates pump on ESP32
                                          - Runs for 3 seconds
```

### 🔧 Hardware Code (ESP32)
```
esp32-firmware/
└── gravity_meter.ino .................... Complete Arduino firmware
                                         - WiFi connectivity
                                         - HTTP web server
                                         - Sensor reading (GPIO 34)
                                         - Pump control (GPIO 26)
                                         - LED indicator (GPIO 2)
```

### ⚙️ Configuration Files
```
package.json ............................. Dependencies & npm scripts
tsconfig.json ............................ TypeScript configuration
next.config.js ........................... Next.js settings
tailwind.config.ts ....................... Tailwind CSS config
postcss.config.js ........................ PostCSS config
.eslintrc.json ........................... Code quality rules
.gitignore ............................... Git ignore patterns
.env.local.example ....................... Environment template
```

### 📁 Directories
```
public/ .................................... Static assets (favicon, images)
node_modules/ ............................. Dependencies (after npm install)
.next/ ..................................... Build output (auto-generated)
```

---

## What Each File Does

### Documentation Files

**GETTING_STARTED.md** (Read First!)
- Step-by-step 5-minute quick start
- 10-step detailed setup process
- Verification checklist
- Troubleshooting guide
- **Start here if you're new**

**README.md** (Complete Reference)
- Feature list
- Installation instructions
- Hardware requirements
- API documentation
- Calibration guide
- Troubleshooting reference
- **Read for full details**

**ARCHITECTURE.md** (Technical Deep Dive)
- System design diagrams
- Component descriptions
- Data flow explanations
- State management details
- Performance characteristics
- **Read to understand internals**

**HARDWARE_WIRING.md** (Build Guide)
- Component list
- Detailed pin connections
- Circuit diagrams
- Power supply setup
- Testing procedures
- Troubleshooting hardware issues
- **Read before wiring**

**ESP32_SETUP.md** (Arduino Guide)
- Library installation
- Board configuration
- Code upload instructions
- Serial monitor verification
- API testing examples
- Sensor calibration
- **Read for ESP32 programming**

**DEPLOYMENT.md** (Go Live)
- Local development setup
- Docker containerization
- Vercel hosting
- VPS deployment
- Monitoring and logging
- Scaling strategies
- **Read when deploying**

**PROJECT_SUMMARY.md** (Overview)
- What you got
- Project structure
- Key features
- Customization points
- Next steps
- **Quick overview**

**QUICK_REFERENCE.md** (Cheat Sheet)
- 3-step setup
- Pin configurations
- API reference
- Common commands
- Troubleshooting table
- **Keep handy**

### Source Code Files

**components/GravityMeter.tsx**
```typescript
- React component for main dashboard
- 300+ lines of code
- Handles:
  * State management (moisture, pump status)
  * API polling (every 2 seconds)
  * Button click handling
  * Error management
  * Beautiful UI rendering
```

**app/page.tsx**
```typescript
- Home page entry point
- Imports and renders GravityMeter
- Sets up page layout
- Simple wrapper component
```

**app/layout.tsx**
```typescript
- Root HTML layout
- Defines <html> and <body>
- Sets up metadata (title, description)
- Applies global styles
- Provides layout structure
```

**app/globals.css**
```css
- Global CSS imports (Tailwind)
- HTML/body default styles
- Smooth scroll behavior
- Gradient background
```

**app/api/soil-status/route.ts**
```typescript
- GET endpoint: /api/soil-status
- Fetches from ESP32:8080/status
- Returns soil moisture & pump status
- Includes error handling
- Mock fallback for development
- ~80 lines
```

**app/api/water/route.ts**
```typescript
- POST endpoint: /api/water
- Sends water command to ESP32:8080/water
- Activates pump for 3 seconds
- Returns success response
- Includes error handling
- Mock fallback for development
- ~90 lines
```

**esp32-firmware/gravity_meter.ino**
```cpp
- Complete Arduino firmware
- 400+ lines of code
- Includes:
  * WiFi connectivity setup
  * HTTP web server
  * GET /status endpoint
  * POST /water endpoint
  * Sensor reading loop (ADC GPIO 34)
  * Pump control (GPIO 26)
  * WiFi status LED (GPIO 2)
  * JSON serial communication
```

### Configuration Files

**package.json**
- Project name and version
- npm scripts (dev, build, start, lint)
- Dependencies list (axios, react, next)
- Dev dependencies (TypeScript, Tailwind)

**tsconfig.json**
- TypeScript compiler options
- Target ES version
- Lib configuration
- Module resolution
- Path aliases (@/*)

**next.config.js**
- React strict mode enabled
- Image optimization settings
- Build configuration

**tailwind.config.ts**
- Content file patterns
- Theme customization
- Plugin configuration

**postcss.config.js**
- Tailwind CSS plugin
- Autoprefixer plugin
- CSS processing

-.eslintrc.json**
- ESLint configuration
- Extends Next.js default config
- Code quality rules

**.env.local.example**
- Template for environment variables
- ESP32_IP configuration
- Copy to .env.local and fill in your IP

**.gitignore**
- Ignores node_modules/
- Ignores .env.local (secrets)
- Ignores .next/ build output
- Ignores log files
- Ignores OS files (.DS_Store)

---

## How Files Work Together

### User Opens Dashboard
```
Browser 
  ↓
app/page.tsx (loads home page)
  ↓
components/GravityMeter.tsx (main UI component)
  ↑
useEffect hook triggers → calls fetch()
  ↓
app/api/soil-status/route.ts (API endpoint)
  ↓
Makes HTTP request to ESP32:8080/status
  ↓
esp32-firmware gravity_meter.ino processes request
  ↓
Reads sensor, returns JSON
  ↓
Response bubbles back up to component
  ↓
Component state updates → UI re-renders
```

### User Clicks Water Button
```
Button onClick event in GravityMeter.tsx
  ↓
POST request to app/api/water/route.ts
  ↓
API forwards to ESP32:8080/water (POST)
  ↓
ESP32 firmware receives POST
  ↓
Sets GPIO 26 HIGH (pump relay on)
  ↓
Starts 3-second timer
  ↓
After 3 seconds: GPIO 26 LOW (pump off)
  ↓
Component shows pump active status
  ↓
Next poll shows increased moisture
  ↓
Icon animates upward
```

---

## Dependencies

### JavaScript Dependencies (npm)
```json
{
  "react": "18.2.0",          - UI library
  "react-dom": "18.2.0",      - DOM rendering
  "next": "14.0.0",           - Framework
  "axios": "1.6.0"            - HTTP requests
}
```

### Dev Dependencies (npm)
```json
{
  "typescript": "5.3.2",       - Type checking
  "tailwindcss": "3.3.6",      - CSS framework
  "autoprefixer": "10.4.16",   - CSS vendor prefixes
  "postcss": "8.4.32",         - CSS processing
  "eslint": "8.55.0",          - Code linting
  "@types/*": "[versions]"     - TypeScript definitions
}
```

### Arduino Libraries (for ESP32)
```
- WiFi (built-in)           - WiFi connectivity
- WebServer (built-in)      - HTTP server
- ArduinoJson (6.x or 7.x)  - JSON parsing
```

---

## File Size Reference

| File | Purpose | Size |
|------|---------|------|
| GravityMeter.tsx | Main component | ~8 KB |
| gravity_meter.ino | Firmware | ~12 KB |
| soil-status/route.ts | API endpoint | ~2 KB |
| water/route.ts | API endpoint | ~2 KB |
| README.md | Documentation | ~15 KB |
| ARCHITECTURE.md | Documentation | ~12 KB |
| Total source | Code | ~40 KB |
| Total docs | Documentation | ~100+ KB |

**Note:** node_modules/ will be ~500 MB after `npm install`

---

## File Dependencies

```
GravityMeter.tsx depends on:
  ├── React (useState, useEffect)
  ├── axios (HTTP requests)
  └── app/api/soil-status
  └── app/api/water

soil-status/route.ts depends on:
  ├── Next.js API (NextRequest, NextResponse)
  ├── fetch API (to reach ESP32)
  └── no other local files

water/route.ts depends on:
  ├── Next.js API (NextRequest, NextResponse)
  ├── fetch API (to reach ESP32)
  └── no other local files

gravity_meter.ino depends on:
  ├── WiFi library (ESP32)
  ├── WebServer library (ESP32)
  ├── ArduinoJson library
  └── no other local files
```

---

## Recommended Reading Order

### For Implementation
1. **GETTING_STARTED.md** - Quick setup
2. **HARDWARE_WIRING.md** - Connect hardware
3. **ESP32_SETUP.md** - Program ESP32

### For Understanding
1. **README.md** - Feature overview
2. **ARCHITECTURE.md** - System design
3. **deployment.md** - Scaling options

### For Reference
- **QUICK_REFERENCE.md** - Keep nearby
- Source code files - For customization
- Configuration files - For settings

---

## Key Takeaways

✅ **24 files total** (23 source + 1 directory)
✅ **Complete and functional** - Ready to use
✅ **Well documented** - 7 comprehensive guides  
✅ **Modular design** - Easy to customize
✅ **Clean code** - TypeScript throughout
✅ **Production ready** - Error handling included

Everything you need is here. Pick a starting point and go! 🚀
