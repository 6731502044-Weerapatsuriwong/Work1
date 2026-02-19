# Hardware Wiring Guide

## Overview

This document provides detailed wiring instructions for connecting the soil moisture sensor, pump, and LEDs to the ESP32 microcontroller.

## Components

### ESP32 Board
- Development board: ESP32-WROOM-32
- Pins used: GPIO 34 (ADC), GPIO 26 (Digital), GPIO 2 (Digital)
- Power: 5V USB or external PSU

### Sensors & Actuators
1. **Soil Moisture Sensor** (Capacitive Recommended)
   - Analog output 0-3.3V
   - VCC, GND, AO (analog out), DO (digital out - optional)

2. **Pump or Relay Module**
   - Relay or MOSFET controlled via GPIO pin
   - Pump: 12V DC or AC
   - Current draw: 1-3A (requires relay or MOSFET for ESP32 safety)

3. **Blue LED** (WiFi indicator)
   - Standard 5mm LED
   - Current: ~20mA at 3.3V
   - Use 220Ω current-limiting resistor

## Pinout

```
ESP32 Pinout (relevant pins):
    |───────────────────────────|
    |  USB                      |
    |                           |
    |  3.3V ─── Pin 3.3V        |  ← Power 3.3V & 5V (via USB)
    |  GND  ─── Pin GND         |  ← Ground (reference all circuits)
    |  D34  ─── Pin GPIO 34     |  ← Soil Moisture (ADC input)
    |  D26  ─── Pin GPIO 26     |  ← Pump Relay Control (Digital output)
    |  D2   ─── Pin GPIO 2      |  ← WiFi Status LED (Digital output)
    |
    |  [Various other pins]
    |
    |───────────────────────────|
```

## Wiring Diagrams

### Circuit 1: Soil Moisture Sensor

```
Soil Moisture Sensor:
    [VCC pin] ──────────── [ESP32 3.3V]
    [GND pin] ──────────── [ESP32 GND]
    [AO pin]  ──────────── [ESP32 GPIO 34 (ADC)]
    (DO pin - optional, skip for analog reading)
```

**Notes:**
- Use GPIO 34 (ADC pin) for analog readings
- This pin reads 0-3.3V from the sensor
- No resistors needed for sensor connection

### Circuit 2: Pump Control with Relay

```
ESP32 ──── GPIO 26 ────┬──────┐
                       │      │
                       │   [Relay Coil]
                      GND      │
                               └──[Relay Contacts]──── Pump Power
                                     (NC/NO contacts)
```

**Detailed Wiring:**

```
Relay Module (5V or 3.3V):
  VCC  ──── ESP32 5V USB power (or external 5V supply)
  GND  ──── ESP32 GND
  IN   ──── ESP32 GPIO 26 (through 220Ω resistor if 5V relay)

Relay Contacts (24A @ 250V typical):
  Common (COM) ──── Pump Positive Power
  Normally Open (NO) should be used
  Other side of NO ──── Pump Ground
```

**Alternative: MOSFET Control**

```
If using MOSFET instead of relay:

ESP32 GPIO 26 ───────┬──[10kΩ resistor]──── GND
                     │
                     └──[Gate of MOSFET (e.g., IRF540N)]
                     
Drain  ──── Pump Positive (12V)
Source ──── Pump Ground (GND)
```

### Circuit 3: WiFi Status LED (Blue)

```
ESP32 GPIO 2 ────[220Ω Resistor]────(LED)────[GND]
                                      │
                    (Blue LED, long pin to GPIO side)
```

**LED Orientation:**
- Long leg (Anode) → Connected to GPIO 2 via resistor
- Short leg (Cathode) → Connected to GND

## Complete Circuit Diagram

```
                    ┌─────────────────────────┐
                    │      ESP32 Board        │
                    │                         │
        USB Power   │  5V  GND  D34  D26  D2  │
            │       │   │    │    │    │    │ │
            └───────┼───┤    │    │    │    │ │
                    │   └────┼────┼────┼────┤ │
                    │        │    │    │    │ │
                    │        │    │    │    │ │
                    └────────┼────┼────┼────┬─┘
                             │    │    │    │
                             │    │    │    │
              ┌──────────────┘    │    │    │
              │                   │    │    │
              │   ┌───────────────┘    │    │
              │   │                    │    │
              │   │   ┌────────────────┘    │
              │   │   │                     │
              │   │   │  ┌──────────────────┘
              │   │   │  │
          [Soil   │   │  │
          Sensor] │   │  │
           VCC    │   │  │
           GND    │   │  │
           AO     │   │  │[220Ω]
                  │   │  │      [Blue LED]
                  │   │  │          │
                  │   │  │         GND
                  │   │  │
                  │   [Relay] ──── [Pump]
                  │   Module
                  │    │
                  │   [GND]
                  │
                 GND
```

## Power Considerations

### ESP32 Power Requirements
- Operating voltage: 3.3V
- Max current: 80mA
- USB connection typically provides sufficient power

### Relay Module Power
- If 5V relay: Use external 5V power supply
- If 3.3V relay: Can use ESP32 3.3V (with current limiting resistor on GPIO pin)

### Pump Power
- Separate 12V power supply required
- **IMPORTANT:** Do NOT connect pump power to ESP32!
- Use relay to switch pump on/off

### Recommended Power Setup

```
┌─────────────────────────────────────┐
│                                     │
│  USB Power (5V/1A) ─── ESP32       │ Soil sensor, LED
│                                     │
│  External 5V PSU ─── Relay Module   │ Relay
│                                     │
│  External 12V PSU ─── Pump          │ Pump
│                                     │
│  Common GND ─── All circuits        │ Ground reference
│                                     │
└─────────────────────────────────────┘
```

## Testing & Verification

### Test 1: Power Supply
```
☐ USB connected to ESP32
☐ 5V relay module powered (if using external supply)
☐ 12V pump supply available
☐ All GND connections secure
```

### Test 2: Sensor Reading
```
☐ Soil sensor connected to GPIO 34
☐ Serial Monitor shows changing values
☐ Dry sensor: ~4095 ADC counts
☐ Wet sensor: ~0 ADC counts
```

### Test 3: Relay Test
```
☐ Relay connected to GPIO 26
☐ Upload test sketch that toggles GPIO 26
☐ Listen for relay click sound
☐ Measure voltage at pump terminals with multimeter
```

### Test 4: LED Test
```
☐ Blue LED connected to GPIO 2
☐ LED lights when WiFi connects
☐ LED dims/bright when GPIO alternate HIGH/LOW
```

## Troubleshooting

| Issue | Symptom | Solution |
|-------|---------|----------|
| Sensor reads 0/4095 | ADC always max or min | Check wiring, try different GPIO pin |
| Relay clicks but pump doesn't run | Pump is silent | Check pump power supply, test pump independently |
| LED doesn't light | No indication | Check LED polarity, verify GPIO is HIGH |
| WiFi won't connect after pump activates | Brownout error | Use separate PSU for pump, add capacitor |
| Inconsistent sensor readings | Values fluctuate wildly | Add decoupling capacitor near sensor, check connections |

## Additional Resources

- ESP32 Datasheet: https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf
- Relay selection guide: [Your relay manufacturer datasheet]
- Soil sensor calibration: See main README.md

## Safety Notes

⚠️ **IMPORTANT:**
- Never connect pump directly to GPIO pin
- Always use relay or MOSFET for pump control
- Use separate power supplies for high-current devices
- Verify all connections before powering on
- Check for loose wires that could cause shorts
