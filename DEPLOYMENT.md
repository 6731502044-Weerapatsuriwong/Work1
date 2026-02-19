# Deployment & Usage Guide

## Quick Reference

### URLs
- **Dashboard**: http://localhost:3000 (development)
- **ESP32 Status**: http://192.168.1.XXX:8080 (replace IP)

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Run linter
npm lint
```

## Deployment Options

### Option 1: Local Development

Best for testing and prototyping.

```bash
npm install
npm run dev
# Open browser to http://localhost:3000
```

### Option 2: Docker Container

Containerize the application for consistent deployment.

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t gravity-meter .
docker run -p 3000:3000 \
  -e ESP32_IP=http://192.168.1.XXX:8080 \
  gravity-meter
```

### Option 3: Vercel Hosting

Deploy to Vercel (Next.js creators).

```bash
npm install -g vercel
vercel
```

Then add environment variables in Vercel dashboard:
```
NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
ESP32_IP=http://192.168.1.XXX:8080
```

### Option 4: Traditional VPS

Deploy to AWS, DigitalOcean, etc.

```bash
# On VPS
git clone <your-repo-url>
cd gravity-meter-dashboard
npm install
npm run build
npm start &
```

## Configuration Files

### .env.local
```env
# Copy from .env.local.example and update IP address
NEXT_PUBLIC_ESP32_IP=http://192.168.1.XXX:8080
ESP32_IP=http://192.168.1.XXX:8080
```

### next.config.js
```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig
```

## Monitoring & Logging

### ESP32 Serial Monitor
```bash
# View ESP32 logs in real-time
# Arduino IDE: Tools → Serial Monitor
# Or use screen/PuTTY on Linux/Windows
```

### Browser Console
Press `F12` in browser to see JavaScript console logs for API debugging.

### Server Logs
Next.js logs appear in terminal running `npm run dev` or `npm start`.

## Performance Tips

1. **Reduce polling interval** for real-time updates
   - Edit `GravityMeter.tsx`: `POLL_INTERVAL = 1000` (1 second)

2. **Add data caching** to reduce API calls
   - Use SWR (Stale-While-Revalidate) library

3. **Optimize images** for mobile
   - Use Next.js Image component

4. **Enable compression** on server
   - Next.js handles gzip by default

## Scaling Considerations

### Multiple Plants
Current code monitors one plant. To scale:

1. Modify database schema
2. Create `/api/plants/[id]/status` route
3. Update component to show plant list
4. Add plant selection UI

### Remote Access
If accessing dashboard remotely:

1. **Use VPN/Tunnel**
   ```bash
   # ngrok example
   ngrok http 3000
   # Get public URL, share with users
   ```

2. **Deploy to cloud server**
   - Add authentication (JWT/OAuth)
   - Use HTTPS only
   - Implement rate limiting

3. **Use IoT platform**
   - AWS IoT Core
   - Azure IoT Hub
   - Google Cloud IoT

## Maintenance

### Regular Tasks

**Weekly:**
- Check moisture readings are reasonable
- Test pump activation
- Monitor blue LED status

**Monthly:**
- Recalibrate soil sensor
- Check relay for corrosion
- Clean sensor probe

**Quarterly:**
- Update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Backup data if logging is implemented

### Updating Code

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Rebuild and restart
npm run build
npm start
```

## Security Best Practices

1. **Never commit `.env.local` with real IP addresses**
   - Use `.env.local.example` as template

2. **Restrict API access** if deployed publicly
   - Add API key authentication
   - Implement rate limiting
   - Use CORS restrictions

3. **Use HTTPS/TLS** for remote access
   - Self-signed certificate for local network
   - LetsEncrypt for public internet

4. **Secure ESP32**
   - Change default WiFi SSID/password
   - Disable HTTP if not needed
   - Use authentication tokens for API

## Troubleshooting Deployment

### Dashboard Can't Connect to ESP32

```bash
# 1. Verify ESP32 is online
ping 192.168.1.XXX

# 2. Test API endpoint directly
curl http://192.168.1.XXX:8080/status

# 3. Check .env.local has correct IP
cat .env.local

# 4. Clear browser cache
# Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
```

### High Memory Usage

```bash
# Profile Next.js bundling
npm run build -- --analyze
```

### Slow Dashboard Response

```bash
# Check network latency
# Browser DevTools → Network tab → view response times

# Optimize:
# 1. Reduce polling interval
# 2. Add caching
# 3. Optimize ESP32 API response time
```

## Feature Additions

### Add Temperature Sensor
```cpp
// In ESP32 code:
const int TEMP_SENSOR_PIN = 35;
// Read: analogRead(TEMP_SENSOR_PIN)
// Convert using calibration
```

### Add Data History
```typescript
// Create database schema for readings
// Add endpoint: GET /api/history?days=7
// Chart with Chart.js or Recharts
```

### Add Notifications
```typescript
// Email alerts when soil is dry
// SMS via Twilio
// Push notifications via Firebase
```

### Add Mobile App
```bash
# Build React Native app from same codebase
# Use Expo for faster development
# Share API endpoints with web version
```

## Backup & Recovery

### Backup Configuration
```bash
# Backup ESP32 firmware
# In Arduino IDE: Sketch → Export Compiled Binary

# Backup Next.js code
git push origin main  # GitHub, GitLab, etc.
```

### Emergency Reset

If something goes wrong:

```bash
# ESP32: Hold BOOT button while plugging in USB
# Clear local data: Delete .next folder
# Reinstall: npm install
```

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **ESP32 Docs**: https://docs.espressif.com
- **Arduino IDE Help**: https://www.arduino.cc/en/Guide
- **GitHub Issues**: Post issues in project repository

## Version History

- **v0.1.0** - Initial release with basic functionality
  - Gravity meter visualization
  - Single pump control
  - Moisture monitoring
  - WiFi connectivity

## Roadmap

- [ ] Multi-plant support
- [ ] Historical data logging
- [ ] Scheduled watering automation
- [ ] Mobile app
- [ ] Integration with home automation (IFTTT, Home Assistant)
