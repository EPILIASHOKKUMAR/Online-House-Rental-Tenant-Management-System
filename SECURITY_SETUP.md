# 🔒 Security Setup Guide

## Email Credentials Security

**IMPORTANT**: Never commit email credentials to git!

### Setup Instructions:

1. **Copy the template to create your local env file**:
   ```bash
   cd backend
   cp .env.local.template .env.local
   ```

2. **Edit `.env.local` with your actual credentials**:
   ```env
   # Database Configuration
   DB_PASSWORD=root@20042713!
   
   # Email Configuration (Your Gmail SMTP)
   EMAIL_USER=balapuvishnu@gmail.com
   EMAIL_PASSWORD=mscqecwcurxlukgk
   SMTP_USER=balapuvishnu@gmail.com
   SMTP_PASS=mscqecwcurxlukgk
   ```

3. **The `.env.local` file is automatically ignored by git** ✅

### Gmail App Password Setup:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to Google Account Settings** → Security → App passwords
3. **Generate an app password** for "Mail"
4. **Use the 16-character password** (not your regular Gmail password)

### File Structure:
```
backend/
├── .env                    # Template with placeholder values (committed)
├── .env.local             # Your actual credentials (NOT committed)
├── .env.local.template    # Template for team members (committed)
├── .env.example           # Documentation template (committed)
└── .gitignore             # Ensures .env.local is ignored (committed)
```

### Security Best Practices:

✅ **DO**:
- Use `.env.local` for sensitive credentials
- Use App Passwords for Gmail
- Keep credentials in environment variables
- Use different credentials for production

❌ **DON'T**:
- Commit real credentials to git
- Share credentials in code or messages
- Use regular Gmail passwords
- Hardcode credentials in source files

### Testing Email:
```bash
cd backend
node test-email.js
```

This will test your email configuration safely using environment variables.

### Production Deployment:

For production, set environment variables directly on your server:
- Heroku: `heroku config:set EMAIL_USER=your-email@gmail.com`
- Vercel: Add in dashboard environment variables
- AWS: Use AWS Secrets Manager
- Docker: Use docker-compose environment files

### Troubleshooting:

If you get authentication errors:
1. Verify 2FA is enabled on Gmail
2. Generate a new App Password
3. Remove spaces from the App Password
4. Check that `.env.local` is being loaded correctly

### Quick Setup for Your Team:

```bash
# 1. Copy template
cp backend/.env.local.template backend/.env.local

# 2. Edit with your credentials
# Replace placeholder values in .env.local

# 3. Test email
cd backend && node test-email.js
```