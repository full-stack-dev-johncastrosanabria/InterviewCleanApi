# ⚠️ IMPORTANT: Start API First!

## The 403 Error is Because API is Not Running

The 403 Forbidden error you're seeing is **NOT** a permissions issue. It's Vite's way of saying "I can't reach the API server to proxy your request."

## ✅ Solution (2 Steps)

### Step 1: Start the API Server

Open a **NEW terminal** and run:

```bash
cd InterviewCleanApi.Api
dotnet run
```

**Wait for this message:**
```
Now listening on: http://localhost:5000
```

**Keep this terminal open!** The API must stay running.

### Step 2: Restart React Client

In your React client terminal:

1. Stop the dev server (Ctrl+C)
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Start again:
   ```bash
   npm run dev
   ```

## 🧪 Test It Works

### Quick Test
Open: `http://localhost:5173/test-proxy.html`

Click "Test /api/products" - you should see:
- ✅ Status: **401** (Unauthorized) - This means proxy is working!
- ❌ Status: **403** (Forbidden) - API is still not running

### Full Test
1. Go to `http://localhost:5173`
2. Login with:
   - Email: `john@test.com`
   - Password: `123456`
3. Should work without errors

## 🔍 Why This Happens

```
Browser → Vite Dev Server (port 5173) → API (port 5000)
                ↓
         If API is not running,
         Vite returns 403
```

When you make a request to `/api/products`:
1. Browser sends to `http://localhost:5173/api/products`
2. Vite proxy tries to forward to `http://localhost:5000/api/products`
3. **If API is not running**, Vite can't connect and returns 403
4. **If API is running**, Vite forwards the request and returns API's response

## 📋 Checklist

Before starting React client, ensure:

- [ ] API is running on port 5000
- [ ] You see "Now listening on: http://localhost:5000" in API terminal
- [ ] API terminal shows no errors
- [ ] Port 5000 is not used by another process

## 🚀 Correct Startup Order

**Always start in this order:**

1. **First:** Start API
   ```bash
   cd InterviewCleanApi.Api
   dotnet run
   ```

2. **Then:** Start React Client
   ```bash
   cd clients/react-client
   npm run dev
   ```

3. **Finally:** Open browser
   ```
   http://localhost:5173
   ```

## 🛠️ Troubleshooting

### "Port 5000 is already in use"
```bash
# Find what's using port 5000
lsof -i :5000

# Kill it
kill -9 <PID>
```

### "API starts but immediately stops"
Check for errors in the API terminal. Common issues:
- Database connection error
- Missing appsettings.json
- Port already in use

### "Still getting 403 after starting API"
1. Verify API is actually running:
   ```bash
   curl http://localhost:5000/api/products
   ```
   Should return 401 (not 403!)

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

3. Restart React dev server

4. Hard refresh browser (Ctrl+Shift+R)

## ✨ Expected Behavior

When everything is working:

1. **API Terminal** shows:
   ```
   Now listening on: http://localhost:5000
   info: Microsoft.Hosting.Lifetime[14]
   ```

2. **React Terminal** shows:
   ```
   VITE v8.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

3. **Browser** shows:
   - Login form (no errors in console)
   - Can login successfully
   - Can see products after login

4. **When you make requests**, React terminal shows:
   ```
   Sending Request to the Target: POST /api/auth/login
   Received Response from the Target: 200 /api/auth/login
   ```

## 🎯 Quick Diagnostic

Run this to check everything:
```bash
./diagnose.sh
```

If it says "API is NOT responding", start the API first!
