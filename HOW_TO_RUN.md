# 🚀 How to Run the Login System

Follow these steps to run the login system on your local machine:

## Prerequisites

1. **Node.js** - Make sure Node.js is installed
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **MongoDB** - Must be running on your system
   - Check if running: Look for `mongod` process
   - Start MongoDB: `mongod` or start MongoDB service

## Step 1: Choose Which Version to Run

You have two versions:
- **usercode/** - Simple student version (good for learning)
- **aicode/** - Advanced AI version (with security features)

## Step 2: Install Dependencies

### For Usercode:
```bash
cd usercode
npm install
```

### For AIcode:
```bash
cd aicode
npm install
```

## Step 3: Start the Server

### For Usercode:
```bash
cd usercode
node server.js
```

### For AIcode:
```bash
cd aicode
node server.js
```

You should see:
```
Server running on http://localhost:3000
Connected to MongoDB
```

## Step 4: Open in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**
3. You should see the Login System homepage!

## Step 5: Try It Out!

1. **Register a new account**
   - Click "Register"
   - Enter username (e.g., "testuser")
   - Enter password (e.g., "password123")
   - Click Register

2. **Login**
   - You'll be redirected to login page
   - Enter your username and password
   - Click Login

3. **Dashboard**
   - After login, you'll see the dashboard
   - It will show: "Welcome [your username]"

4. **Logout**
   - Click the Logout button
   - You'll be redirected to home page

## Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:** Make sure MongoDB is running
```bash
# Windows - Start MongoDB as a service
net start MongoDB

# Or run mongod directly
mongod
```

### Problem: "Port 3000 is already in use"
**Solution:** 
- Stop any other server running on port 3000
- Or change the port in server.js (change `PORT = 3000` to another number)

### Problem: "Cannot GET /"
**Solution:** Make sure you installed dependencies first:
```bash
npm install
```

### Problem: "Module not found"
**Solution:** Delete node_modules and reinstall:
```bash
rm -r node_modules
npm install
```

## Running Both Versions at the Same Time

If you want to run both versions simultaneously:

1. **First, change the port in one version:**
   - Open `aicode/server.js` or `usercode/server.js`
   - Change `PORT = 3000` to `PORT = 3001`

2. **Run first version:**
   ```bash
   cd usercode
   node server.js
   ```

3. **Open new terminal, run second version:**
   ```bash
   cd aicode
   node server.js
   ```

4. **Access them:**
   - Usercode: http://localhost:3000
   - AIcode: http://localhost:3001

## Quick Test Commands

Test the API directly (optional):

```bash
# Register a user
curl -X POST http://localhost:3000/register -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"test123\"}"

# Login
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"test123\"}" -c cookies.txt

# Access Dashboard
curl http://localhost:3000/dashboard -b cookies.txt

# Logout
curl http://localhost:3000/logout -b cookies.txt
```

## Stop the Server

Press **Ctrl + C** in the terminal to stop the server.

## Important Notes

⚠️ **Security Warning:** 
- The **usercode** version stores passwords in plain text - only for learning!
- The **aicode** version uses bcrypt for password hashing - more secure
- Never use usercode approach in real projects!

✅ **Database:** 
- All user data is stored in MongoDB database named `studentDB`
- Collection name: `users`
- You can view data using MongoDB Compass or mongosh

## Need Help?

Common issues:
1. MongoDB not running → Start MongoDB service
2. Port already in use → Change port number or stop other server
3. Dependencies missing → Run `npm install`
4. Can't access in browser → Check if server is actually running

---

**Enjoy your Login System! 🎉**
