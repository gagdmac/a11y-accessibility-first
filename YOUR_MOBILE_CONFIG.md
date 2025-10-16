# 📱 YOUR Mobile Access Configuration

## ✅ Your Computer's IP Address
```
192.168.1.42
```

## 🚀 Start the Server

Run this command:
```bash
npm start
```

The server will start on port **4200** with network access enabled.

## 📱 Access from Your Mobile

**Make sure your mobile is on the same WiFi network!**

Open your mobile browser (Safari, Chrome, etc.) and go to:

```
http://192.168.1.42:4200
```

## ⚡ Quick Test Steps

### 1. Start Server
```bash
npm start
```

Wait for this message:
```
** Angular Live Development Server is listening on 0.0.0.0:4200 **
```

### 2. Test on Computer First
Open this in your computer's browser:
```
http://192.168.1.42:4200
```

If this works ✅, then continue to mobile.

### 3. Access from Mobile
On your mobile browser, type:
```
http://192.168.1.42:4200
```

## 🔧 If Still Not Working

### Check 1: Same WiFi Network?
- Computer WiFi: Check System Preferences → Network
- Mobile WiFi: Check Settings → WiFi
- **Both must be on the SAME network name**

### Check 2: Firewall Settings

**macOS Firewall:**
```bash
# Temporarily disable firewall to test
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# After testing, re-enable it
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

**Or allow Node through firewall:**
- System Preferences → Security & Privacy → Firewall
- Click "Firewall Options"
- Click "+" and add Node.js
- Allow incoming connections

### Check 3: Test Connection from Computer

```bash
# Test if your IP is accessible
curl http://192.168.1.42:4200

# Or open in browser
open http://192.168.1.42:4200
```

### Check 4: Verify Server Output

Look for **exactly this**:
```
** Angular Live Development Server is listening on 0.0.0.0:4200 **
```

NOT this (won't work for mobile):
```
** Angular Live Development Server is listening on 127.0.0.1:4200 **
```

## 🎯 Configuration Details

I've updated your `package.json` with these commands:

```json
"start": "ng serve --host 0.0.0.0 --port 4200 --disable-host-check"
```

**What this does:**
- `--host 0.0.0.0` = Listen on all network interfaces (allows mobile access)
- `--port 4200` = Force port 4200 (no random ports)
- `--disable-host-check` = Allow access from different hostnames/IPs

## 📋 Complete Troubleshooting

### Problem: "This site can't be reached" on mobile

**Solution A - Check WiFi:**
```bash
# On computer, check your network
networksetup -getinfo Wi-Fi

# Ensure mobile shows same network name in WiFi settings
```

**Solution B - Ping Test:**

On mobile, install a network utility app and ping:
```
192.168.1.42
```

If ping fails → Network/firewall issue
If ping works → Check if server is running

**Solution C - Use Alternative IP:**

Your computer might have multiple IPs. Check all:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Try each IP address on mobile.

### Problem: Connection timeout

**Likely cause:** Firewall blocking

**Quick test:**
```bash
# Temporarily disable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Test mobile access
# Then re-enable firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

### Problem: "Websocket connection failed"

This is normal with `--host 0.0.0.0`. Add `--disable-host-check` (already added in config).

## ✅ Working Example

Your complete workflow:

```bash
# Terminal 1: Get your IP (verify it's still 192.168.1.42)
ipconfig getifaddr en0

# Terminal 2: Start server
npm start

# Wait for: "listening on 0.0.0.0:4200"

# Computer browser: Test locally
open http://192.168.1.42:4200

# Mobile browser: Access
# Type in URL: http://192.168.1.42:4200
```

## 🔍 Verification Checklist

Before testing on mobile:

- [ ] Server shows: `listening on 0.0.0.0:4200`
- [ ] Computer browser loads: `http://192.168.1.42:4200`
- [ ] Both devices on same WiFi network
- [ ] Firewall allows Node.js connections
- [ ] Using `http://` not `https://`
- [ ] Port 4200 in URL
- [ ] Correct IP: `192.168.1.42`

## 📱 Testing WCAG Features

Once connected, test these on your mobile:

### 1. Device Font Size (WCAG 1.4.4)
```
iOS: Settings → Display & Brightness → Text Size → Maximum
Android: Settings → Display → Font size → Largest
```

Then reload your app and verify text scales.

### 2. Reflow at 320px (WCAG 1.4.10)
- Portrait mode on iPhone SE or small Android
- Should have no horizontal scrolling
- Content stacks vertically

### 3. Touch Targets
- All buttons should be easy to tap (44x44px minimum)
- Test dropdowns on touch device
- Test navigation on mobile

### 4. Screen Reader
```
iOS: Settings → Accessibility → VoiceOver → On
Android: Settings → Accessibility → TalkBack → On
```

## 🆘 Still Not Working?

### Nuclear Option - Complete Reset:

```bash
# 1. Stop all Node processes
killall node

# 2. Clear DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 3. Restart WiFi
networksetup -setairportpower en0 off
sleep 2
networksetup -setairportpower en0 on

# 4. Get fresh IP
ipconfig getifaddr en0

# 5. Start server
npm start

# 6. Test on mobile
```

### Alternative: Use ngrok

If local network isn't working, use ngrok for testing:

```bash
# Terminal 1
npm run start:local

# Terminal 2
ngrok http 4200

# Use the ngrok URL on mobile (works from anywhere!)
```

---

## 🎉 Quick Reference

**Your IP:** `192.168.1.42`
**Port:** `4200`
**Mobile URL:** `http://192.168.1.42:4200`

**Command:** `npm start`

---

Last updated: October 16, 2025
Your network: 192.168.1.x
