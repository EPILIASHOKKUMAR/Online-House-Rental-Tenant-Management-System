# Setup New Database - Railway Expired

## Problem: Railway free plan expired

## Solution: Use Aiven (Free Forever)

### Quick Setup (10 minutes):

1. **Go to Aiven:**
   - Visit: https://aiven.io
   - Click "Sign up free"
   - Use email or Google

2. **Create MySQL Service:**
   - Click "Create service"
   - Select "MySQL"
   - Choose "Free plan"
   - Select region (AWS US East)
   - Name: house-rental-db
   - Click "Create service"
   - Wait 2-3 minutes for "Running" status

3. **Get Credentials:**
   - Click your service
   - Overview tab shows:
     - Host
     - Port
     - User (avnadmin)
     - Password
     - Database (defaultdb)

4. **Create Tables:**
   - Click "Query editor" tab
   - Run the SQL from backend/create-tables.js

5. **Update Render:**
   - Render dashboard → Your service → Environment
   - Update:
     - DB_HOST = [Aiven host]
     - DB_PORT = [Aiven port]
     - DB_USER = avnadmin
     - DB_PASSWORD = [Aiven password]
     - DB_NAME = defaultdb
   - Save changes

6. **Test:**
   - Wait 2 minutes for redeploy
   - Check: https://online-house-rental-tenant-management.onrender.com/api/health
   - Try login

Done! ✅
