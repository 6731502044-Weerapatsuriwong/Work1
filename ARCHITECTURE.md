# Architecture Overview

## System Design

The Gravity Meter Dashboard uses a client-server architecture with three main components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Web Dashboard Layer                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js Application (React + TypeScript)             │ │
│  │  • GravityMeter Component (UI)                         │ │
│  │  • Real-time polling (2-second intervals)              │ │
│  │  • Tailwind CSS styling                                │ │
│  └────────────┬─────────────────────────────────────────┘ │
│               │                                             │
│  ┌────────────▼─────────────────────────────────────────┐ │
│  │  Next.js API Routes (Backend)                        │ │
│  │  • GET /api/soil-status (fetch moisture)             │ │
│  │  • POST /api/water (activate pump)                   │ │
│  │  • Request forwarding to ESP32                       │ │
│  └────────────┬─────────────────────────────────────────┘ │
│               │                                             │
└───────────────┼─────────────────────────────────────────────┘
                │ HTTP/HTTPS
                │ WiFi Network
                ▼
   ┌────────────────────────────┐
   │  ESP32 Microcontroller     │
   │  ┌──────────────────────┐  │
   │  │ Web Server (Port 8080)   │
   │  │ • GET /status        │  │
   │  │ • POST /water        │  │
   │  └───┬──────────────────┘  │
   │      │                      │
   │  ┌───▼──────────────────┐  │
   │  │ Sensor/Control Logic │  │
   │  │ • Read ADC GPIO 34   │  │
   │  │ • Control GPIO 26    │  │
   │  │ • LED GPIO 2         │  │
   │  └───┬──────────────────┘  │
   │      │                      │
   └──────┼──────────────────────┘
          │
    ┌─────┴──────────┬──────────────┐
    ▼                 ▼               ▼
┌──────────┐  ┌─────────────┐  ┌─────────┐
│  Soil    │  │  Relay/     │  │ BlueLED │
│Moisture  │  │  Pump       │  │(WiFi)   │
│Sensor    │  │  Control    │  │         │
└──────────┘  └─────────────┘  └─────────┘
```

## Component Details

### Frontend Layer

**Technology Stack:**
- React 18 with TypeScript
- Next.js 14 (App Router)
- Tailwind CSS
- Axios for HTTP requests

**Key Files:**
```
components/
└── GravityMeter.tsx        # Main interactive component
    ├── State management (React hooks)
    ├── API communication (fetch soil status)
    ├── Event handling (water button click)
    └── UI rendering (gravity visualization)
```

**Features:**
- Real-time moisture level display (0-100%)
- Animated gravity visualization
  - Icon falls as soil dries
  - Icon floats up when watered
- Live pump status indicator
- Last update timestamp
- Error handling and user feedback
- Responsive design for mobile/desktop

### Backend Layer

**Technology Stack:**
- Next.js API Routes (Node.js)
- TypeScript
- Axios for HTTP client

**API Endpoints:**

#### 1. GET `/api/soil-status`
```
Purpose: Get current soil moisture and pump status
Request: GET /api/soil-status
Response: {
  "moisture": 65,           // 0-100 percentage
  "isPumping": false,       // Boolean
  "temperature": 22.5,      // Optional
  "timestamp": "2024-02-19T10:30:00Z"
}
```

#### 2. POST `/api/water`
```
Purpose: Activate the pump for watering
Request:  POST /api/water
Body: {"duration": 3000}  // Optional, milliseconds

Response: {
  "success": true,
  "message": "Pump activated successfully",
  "pumpDuration": 3000
}
```

**Error Handling:**
- Graceful fallback to mock data if ESP32 unavailable
- HTTP error status codes propagated
- Console logging for debugging

### Microcontroller Layer

**Hardware:**
- ESP32-WROOM-32 Development Board
- Arduino framework (C++)

**Key Files:**
```
esp32-firmware/
└── gravity_meter.ino       # Main firmware
    ├── WiFi connectivity
    ├── Web server (8080)
    ├── Sensor reading (ADC)
    ├── Pump control (GPIO)
    └── LED indicator
```

**Responsibilities:**
1. **Sensor Reading**
   - Read ADC pin every 100ms
   - Convert raw ADC (0-4095) to percentage (0-100%)
   - Calibration: Map wet~0 to dry~4095

2. **Pump Control**
   - Activate relay on POST /water
   - Run for specified duration (default 3s)
   - Auto-shutoff after timeout

3. **WiFi Communication**
   - Connect to local WiFi network
   - Run HTTP server on port 8080
   - Respond to status and water requests
   - Blue LED indicates WiFi connection

## Data Flow

### Reading Soil Moisture

```
1. Dashboard loads → fetch /api/soil-status
2. Next.js API route receives request
3. API makes HTTP GET to ESP32:8080/status
4. ESP32 reads ADC value from GPIO 34
5. ESP32 converts to percentage (0-100%)
6. ESP32 returns JSON with moisture level
7. API route forwards response to frontend
8. React component updates state
9. UI re-renders with new moisture value
10. Gravity icon position updates with animation
11. Repeat every 2 seconds
```

### Watering Plant

```
1. User clicks "Water Now" button
2. onClick handler calls POST /api/water
3. React button shows loading state
4. Next.js API route receives request
5. API makes HTTP POST to ESP32:8080/water
6. ESP32 sets GPIO 26 HIGH (relay/pump on)
7. ESP32 starts timer for 3 seconds
8. ESP32 responds with success
9. API route returns response to frontend
10. React component updates pump status
11. After 3 seconds, ESP32 sets GPIO 26 LOW
12. Gravity icon animates floating up
13. Subsequent polls show increased moisture
14. Button re-enabled when pump finishes
```

## State Management

### Frontend State
```typescript
interface SoilData {
  moisture: number;      // 0-100 %
  isPumping: boolean;    // Pump active
}

// React hooks used:
- useState: soil data, loading, error, timestamp
- useEffect: setup polling on mount, cleanup on unmount
```

### ESP32 State
```cpp
// Volatile variables:
unsigned long pumpStartTime;   // When pump was activated
bool pumpActive;               // Current pump state
int currentMoisture;           // Last sensor reading (0-100)
```

## Configuration & Environment

### Environment Variables
```env
NEXT_PUBLIC_ESP32_IP    # Browser can access (frontend)
ESP32_IP                # Server-side only (backend API)
```

### Compile-time Options (ESP32)
```cpp
const int SOIL_MOISTURE_PIN = 34;    // ADC pin
const int PUMP_PIN = 26;              // Control pin
const int BLUE_LED_PIN = 2;           // Status pin
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
```

## Error Handling Strategy

### Frontend Errors
```typescript
// Network errors:
- Fallback to previous state
- Display error message to user
- Retry on next poll

// Invalid response:
- Log to console
- Show error banner
- Allow manual refresh
```

### Backend Errors
```typescript
// ESP32 unavailable:
- Return mock data in development
- Return 503 Service Unavailable in production
- Log error with timestamp

// Invalid JSON from ESP32:
- Parse error handling
- Return structured error response
```

### Protocol Errors
```
- 200 OK: Success
- 400 Bad Request: Invalid input
- 503 Service Unavailable: ESP32 offline
- 500 Internal Server Error: Server issue
```

## Performance Characteristics

### Response Times (Expected)
- Dashboard load: < 2 seconds
- API response (local network): 50-200ms
- Sensor read: 10ms (ADC)
- Pump activation: < 50ms

### Polling Interval
- Default: 2000ms (2 seconds)
- Configurable in GravityMeter.tsx
- Trade-off: Real-time vs. bandwidth

### Data Usage (Approximate)
- Per poll: ~300 bytes JSON
- At 2-second interval: ~150 bytes/second
- 1 hour monitoring: ~540 KB
- Very minimal traffic

## Scalability Considerations

### Current Limitations
- Single plant monitoring
- Local network only (same WiFi)
- No data persistence
- No user authentication

### Scaling Path

**Single to Multiple Plants:**
```
1. Add database (SQLite/PostgreSQL)
2. Create plant records with unique IDs
3. Multiple ESP32 devices (one per plant)
4. Plant selector in UI
5. /api/plants/:id/status endpoints
```

**Remote Access:**
```
1. Deploy to cloud (Vercel, AWS, etc.)
2. Add HTTPS/TLS
3. Implement API authentication (JWT)
4. Rate limiting
5. Data logging
```

**Advanced Features:**
```
1. Scheduled watering automation
2. Historical graphs and analytics
3. Mobile app (React Native/Flutter)
4. System integrations (Home Assistant, IFTTT)
5. Multiple user accounts
```

## Technology Decisions

### Why Next.js?
- Unified frontend/backend in one framework
- API routes for microcontroller communication
- Deployed as single unit
- Strong TypeScript support
- Built-in optimization and hot reloading

### Why ESP32?
- Built-in WiFi (not boards like Arduino Uno)
- Sufficient processing power for sensor reading
- ADC for analog sensor input
- GPIO for relay control
- Cost-effective (~$10-15)

### Why Tailwind CSS?
- Rapid UI development
- Responsive design out-of-box
- Minimal CSS to maintain
- Dark mode ready

## Monitoring & Observability

Future enhancements:
```
- Sensor data logging to database
- API request/response logging
- Performance metrics (latency, uptime)
- ESP32 system health (WiFi RSSI, memory, uptime)
- Alert system (low moisture, sensor failure)
```

## Security Architecture

### Current Implementation
- No authentication (local network only)
- HTTP (not HTTPS on local network)
- CORS disabled for local requests

### Secure Deployment (Production)
```
1. HTTPS/TLS encryption
2. API authentication (API keys or JWT)
3. Rate limiting per user
4. Input validation on all endpoints
5. Request signing for ESP32 commands
6. Secure password storage if multi-user
```

## Testing Strategy

### Recommended Testing
```
Frontend:
- Component unit tests (Jest)
- Integration tests (Playwright)
- E2E testing with mock ESP32

Backend:
- API endpoint tests
- Error handling tests
- Timeout and retry logic

Hardware:
- Sensor calibration verification
- Relay activation testing
- WiFi connectivity testing
```
