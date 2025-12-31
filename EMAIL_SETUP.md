# Email Setup Guide for Forgot Password Feature

This guide explains how to set up email functionality for the forgot password feature.

## 📧 Email Service Options

### Option 1: Gmail SMTP (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

3. **Update .env file**:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM_NAME=House Rental System
```

### Option 2: Outlook/Hotmail SMTP

```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_SERVICE=outlook
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

### Option 3: Yahoo SMTP

```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=yahoo
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

### Option 4: Custom SMTP Server

```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 🚀 Production Email Services

For production, consider using professional email services:

### SendGrid
```bash
npm install @sendgrid/mail
```

### Mailgun
```bash
npm install mailgun-js
```

### Amazon SES
```bash
npm install aws-sdk
```

## 🔧 How It Works

1. **User requests password reset** → Enters email
2. **System generates secure token** → Stores in database with expiration
3. **Email sent with reset link** → Contains token as URL parameter
4. **User clicks link** → Redirected to reset password page
5. **User enters new password** → Token validated and password updated

## 📝 Email Template Features

- **Professional HTML design** with inline CSS
- **Responsive layout** for mobile devices
- **Security warnings** and expiration notices
- **Fallback text version** for email clients
- **Branded styling** matching your application

## 🔒 Security Features

- **Token expiration** (1 hour by default)
- **One-time use tokens** (cleared after use)
- **Secure token generation** using random strings
- **Email validation** before sending
- **Rate limiting** (can be added)

## 🧪 Testing

### Development Mode
- Reset tokens are shown in API response for testing
- Email service failures fall back to showing token
- Console logs show email sending status

### Production Mode
- Tokens are only sent via email
- No fallback token display
- Proper error handling for email failures

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid login" error**:
   - Use App Password, not regular password
   - Enable 2-Factor Authentication first

2. **"Connection refused" error**:
   - Check SMTP server settings
   - Verify port and security settings

3. **Emails not received**:
   - Check spam/junk folder
   - Verify email address is correct
   - Check email service quotas

4. **SSL/TLS errors**:
   - Try `EMAIL_SECURE=false` for port 587
   - Use `EMAIL_SECURE=true` for port 465

## 📊 Email Analytics (Optional)

You can add email tracking by integrating with services like:
- SendGrid Analytics
- Mailgun Analytics
- Google Analytics UTM parameters

## 🔄 Customization

### Email Template Customization
Edit `backend/src/services/emailService.ts`:
- Modify HTML template
- Change styling and branding
- Add company logo
- Customize email content

### Token Expiration
Change token expiration time in `auth.controller.ts`:
```typescript
const resetExpires = new Date(Date.now() + 3600000); // 1 hour
// Change to: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
```

## 🚨 Important Notes

- **Never commit real email credentials** to version control
- **Use environment variables** for all sensitive data
- **Test thoroughly** before deploying to production
- **Monitor email delivery rates** in production
- **Implement rate limiting** to prevent abuse
- **Log email activities** for debugging and analytics