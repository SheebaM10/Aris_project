# ARIS Email Setup Guide

## 🔧 Gmail SMTP Configuration

To enable email sending from `karanjibuddy@gmail.com`, follow these steps:

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. In Google Account Settings > Security
2. Click on "2-Step Verification"
3. Scroll down to "App passwords"
4. Select "Mail" as the app
5. Select "Other (Custom name)" as the device
6. Enter "ARIS HR System" as the name
7. Click "Generate"
8. **Copy the generated 16-character password**

### Step 3: Update Environment Variables
Update your `.env.local` file with the app password:

```bash
# Replace 'your-gmail-app-password-here' with the actual app password
EMAIL_PASS=abcd efgh ijkl mnop
```

### Step 4: Complete Configuration
Your `.env.local` should have:

```bash
EMAIL_SERVICE=gmail
EMAIL_USER=karanjibuddy@gmail.com
EMAIL_PASS=qauk izoc kaqc tjoo
FROM_EMAIL=karanjibuddy@gmail.com
FROM_NAME=ARIS HR Intelligence System
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 🧪 Testing Email Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to the Workforce tab in ARIS dashboard
3. Try sending a test email
4. Check the terminal for success/error messages

## 🔍 Troubleshooting

### Error: "Username and Password not accepted"
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Factor Authentication is enabled
- Double-check the email address is `karanjibuddy@gmail.com`

### Error: "Invalid login"
- The app password might be incorrect
- Regenerate a new app password and update `.env.local`

### Error: "Connection timeout"
- Check your internet connection
- Verify SMTP settings (host: smtp.gmail.com, port: 587)

## 📧 Email Flow

1. **Primary**: Gmail SMTP (karanjibuddy@gmail.com)
2. **Fallback**: Mock email service (for testing)

## 🔒 Security Notes

- Never commit your actual app password to version control
- Keep `.env.local` in `.gitignore`
- Use different app passwords for different applications
- Regularly rotate app passwords for security

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Check the terminal/server logs
3. Verify all environment variables are set correctly
4. Ensure Gmail account settings are configured properly
