import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

/**
 * Email Configuration Tester
 * Tests Gmail SMTP connection without sending actual emails
 */

const EMAIL_CONFIG = {
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USER: process.env.EMAIL_USER || 'karanjibuddy@gmail.com',
  PASS: process.env.EMAIL_PASS || 'your-gmail-app-password-here',
  FROM_EMAIL: process.env.FROM_EMAIL || 'karanjibuddy@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'ARIS HR Intelligence System',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || false
}

function createTransporter() {
  if (EMAIL_CONFIG.SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASS
      }
    })
  } else {
    return nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP_HOST,
      port: EMAIL_CONFIG.SMTP_PORT,
      secure: EMAIL_CONFIG.SMTP_SECURE,
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASS
      }
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing email configuration...')
    
    // Check environment variables
    const configStatus = {
      EMAIL_USER: EMAIL_CONFIG.USER,
      FROM_EMAIL: EMAIL_CONFIG.FROM_EMAIL,
      SMTP_HOST: EMAIL_CONFIG.SMTP_HOST,
      SMTP_PORT: EMAIL_CONFIG.SMTP_PORT,
      PASSWORD_SET: EMAIL_CONFIG.PASS !== 'your-gmail-app-password-here' && EMAIL_CONFIG.PASS !== 'your-app-password-here'
    }
    
    console.log('📋 Configuration Status:', configStatus)
    
    if (!configStatus.PASSWORD_SET) {
      return NextResponse.json({
        success: false,
        error: 'Gmail App Password not configured',
        config: configStatus,
        instructions: [
          '1. Enable 2-Factor Authentication on Gmail account',
          '2. Generate App Password for Mail',
          '3. Update EMAIL_PASS in .env.local',
          '4. Restart development server',
          '5. See EMAIL_SETUP_GUIDE.md for detailed instructions'
        ]
      })
    }
    
    // Test SMTP connection
    const transporter = createTransporter()
    
    console.log('🔌 Testing SMTP connection...')
    await transporter.verify()
    
    console.log('✅ Email configuration test passed!')
    
    return NextResponse.json({
      success: true,
      message: 'Email configuration is working correctly',
      config: configStatus,
      status: 'ready_to_send'
    })
    
  } catch (error: any) {
    console.error('❌ Email configuration test failed:', error.message)
    
    let troubleshooting = []
    
    if (error.code === 'EAUTH') {
      troubleshooting = [
        'Authentication failed - check Gmail App Password',
        'Ensure 2-Factor Authentication is enabled on Gmail',
        'Verify EMAIL_USER matches the Gmail account',
        'Generate a new App Password if needed'
      ]
    } else if (error.code === 'ECONNECTION') {
      troubleshooting = [
        'Connection failed - check internet connectivity',
        'Verify SMTP settings (host, port)',
        'Check firewall/proxy settings'
      ]
    } else {
      troubleshooting = [
        'Check all environment variables in .env.local',
        'Restart development server after changes',
        'See EMAIL_SETUP_GUIDE.md for setup instructions'
      ]
    }
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      troubleshooting,
      config: {
        EMAIL_USER: EMAIL_CONFIG.USER,
        FROM_EMAIL: EMAIL_CONFIG.FROM_EMAIL,
        SMTP_HOST: EMAIL_CONFIG.SMTP_HOST,
        SMTP_PORT: EMAIL_CONFIG.SMTP_PORT,
        PASSWORD_SET: EMAIL_CONFIG.PASS !== 'your-gmail-app-password-here' && EMAIL_CONFIG.PASS !== 'your-app-password-here'
      }
    }, { status: 500 })
  }
}
