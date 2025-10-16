# 🔧 Mobile Testing - Troubleshooting Guide

## Issue: "Port 4200 is already in use"

This means you have another instance of the server running.

### Solution 1: Kill the Existing Process

```bash
# Find and kill the process using port 4200
lsof -ti:4200 | xargs kill -9

# Then start the server
npm start
```

### Solution 2: Use Alternative Port

I've added a new script for you:

```bash
# Use port 4201 instead
npm run start:mobile
```

Then access from mobile:
```
http://YOUR_IP:4201
```

## 📋 Complete Troubleshooting Steps

### Step 1: Get Your IP Address

```bash
# macOS - Get WiFi IP
ipconfig getifaddr en0
```

Expected output: `192.168.1.123` (or similar)

### Step 2: Check if Port is in Use

```bash
# Check what's using port 4200
lsof -i:4200
```

### Step 3: Kill Existing Process

```bash
# Kill the process
lsof -ti:4200 | xargs kill -9

# Verify it's gone
lsof -i:4200
```

### Step 4: Start the Server

Choose one:

```bash
# Option A: Standard port (4200)
npm start

# Option B: Alternative port (4201) 
npm run start:mobile

# Option C: Localhost only (no mobile)
npm run start:local
```

### Step 5: Verify Server is Running

You should see:
```
** Angular Live Development Server is listening on 0.0.0.0:4200 **
```

### Step 6: Access from Mobile

**On your mobile device (same WiFi):**

If using port 4200:
```
http://192.168.1.123:4200
```

If using port 4201:
```
http://192.168.1.123:4201
```

## 🚫 Common Issues

### Issue: "Connection Refused"

**Cause:** Server not started or wrong IP

**Fix:**
```bash
# 1. Verify server is running
# Look for "listening on 0.0.0.0:4200" message

# 2. Double-check your IP
ipconfig getifaddr en0

# 3. Ensure using correct port
# Check terminal output for port number
```

### Issue: "Can't reach this page"

**Cause:** Not on same WiFi network

**Fix:**
- Connect mobile to same WiFi as computer
- Check if both devices can see each other:
  ```bash
  # From computer, ping mobile (if you know mobile IP)
  ping 192.168.1.XXX
  ```

### Issue: Firewall Blocking Connection

**macOS Fix:**
```bash
# System Preferences > Security & Privacy > Firewall
# Click "Firewall Options"
# Ensure Node.js is allowed
# Or temporarily disable firewall for testing
```

**Windows Fix:**
```
# Windows Defender Firewall
# Allow an app through firewall
# Find Node.js and check both Private and Public
```

### Issue: Multiple Servers Running

**Check all Node processes:**
```bash
# List all node processes
ps aux | grep node

# Kill specific process by PID
kill -9 PID_NUMBER

# Or kill all node processes (nuclear option)
killall node
```

### Issue: Port Permission Error

**Fix:**
```bash
# Use a higher port number (no sudo needed)
ng serve --host 0.0.0.0 --port 8080

# Access as: http://YOUR_IP:8080
```

## 🎯 Quick Test Commands

```bash
# 1. Check your IP
ipconfig getifaddr en0

# 2. Check port availability
lsof -i:4200

# 3. Kill if needed
lsof -ti:4200 | xargs kill -9

# 4. Start server
npm start

# 5. Test locally first
curl http://localhost:4200

# 6. Test with IP
curl http://$(ipconfig getifaddr en0):4200
```

## 📱 Mobile Access Checklist

Before accessing from mobile:

- [ ] Server is running (`npm start` executed)
- [ ] See "listening on 0.0.0.0:4200" message
- [ ] Know your computer's IP address
- [ ] Mobile and computer on same WiFi
- [ ] No firewall blocking port 4200
- [ ] Using `http://` not `https://`
- [ ] Correct port number in URL

## 🔍 Debugging Steps

### Test 1: Can you access on computer?

```bash
# Open in your computer's browser
open http://localhost:4200
```

If NO: Server isn't running properly
If YES: Continue to Test 2

### Test 2: Can you access via IP on computer?

```bash
# Get your IP
MY_IP=$(ipconfig getifaddr en0)

# Open in browser
open http://$MY_IP:4200
```

If NO: Network configuration issue
If YES: Continue to Test 3

### Test 3: Can mobile ping computer?

On mobile, use a network testing app to ping your computer's IP.

If NO: Network/firewall issue
If YES: Try accessing in mobile browser

### Test 4: Check server output

Look for these messages:

✅ Good:
```
** Angular Live Development Server is listening on 0.0.0.0:4200 **
```

❌ Bad:
```
** Angular Live Development Server is listening on 127.0.0.1:4200 **
```
(This means localhost only - won't work for mobile)

## 💡 Pro Tips

### Tip 1: Add IP to Terminal Prompt

```bash
# Show your IP when server starts
echo "Your IP: $(ipconfig getifaddr en0)"
npm start
```

### Tip 2: Create QR Code

```bash
# Install QR code generator
npm install -g qrcode-terminal

# Generate QR for your IP
qrcode-terminal http://$(ipconfig getifaddr en0):4200

# Scan with mobile camera!
```

### Tip 3: Auto-Open on Multiple Devices

```bash
# Start server and open on computer
npm start -- --open

# Share the IP:4200 link with mobile
```

### Tip 4: Use ngrok for Remote Testing

If you need to test from outside your network:

```bash
# Install ngrok
brew install ngrok

# In one terminal
npm start

# In another terminal
ngrok http 4200

# Use the ngrok URL on any device, anywhere!
```

## 📊 Available Scripts (Updated)

```json
"start": "ng serve --host 0.0.0.0 --port 4200"
  → For mobile testing, uses port 4200

"start:mobile": "ng serve --host 0.0.0.0 --port 4201"
  → Alternative port if 4200 is busy

"start:local": "ng serve --host 127.0.0.1"
  → Localhost only, no mobile access
```

## 🆘 Still Not Working?

Try this complete reset:

```bash
# 1. Kill all node processes
killall node

# 2. Clear npm cache
npm cache clean --force

# 3. Restart your computer (ensures clean state)

# 4. Get fresh IP
ipconfig getifaddr en0

# 5. Start server
npm start

# 6. Verify output shows 0.0.0.0:4200

# 7. Test on computer first
open http://$(ipconfig getifaddr en0):4200

# 8. Then try mobile
```

## 📞 Quick Reference Card

```bash
# GET IP
ipconfig getifaddr en0

# CHECK PORT
lsof -i:4200

# KILL PORT
lsof -ti:4200 | xargs kill -9

# START SERVER
npm start

# ACCESS FROM MOBILE
http://YOUR_IP:4200
```

## ✅ Success Indicators

You'll know it's working when:

1. Terminal shows: `listening on 0.0.0.0:4200`
2. Computer browser loads: `http://localhost:4200`
3. Computer browser loads: `http://YOUR_IP:4200`
4. Mobile browser loads: `http://YOUR_IP:4200`
5. No errors in mobile browser console

---

**Most Common Fix:**
```bash
lsof -ti:4200 | xargs kill -9 && npm start
```

This kills any existing server and starts fresh!
