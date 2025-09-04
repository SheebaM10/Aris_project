/**
 * Advanced Email Testing API - /api/email-test-advanced
 * 
 * Comprehensive email deliverability testing and diagnostics
 * Tests multiple scenarios and provides detailed feedback
 */

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const EMAIL_CONFIG = {
  SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  USER: process.env.EMAIL_USER || 'karanjibuddy@gmail.com',
  PASS: process.env.EMAIL_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'karanjibuddy@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'ARIS HR Intelligence System',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true' || false
}

/**
 * Test email deliverability with multiple approaches
 */
export async function POST(request: NextRequest) {
  try {
    const { testEmail = 'shivani@karanji.com', runAllTests = true } = await request.json()
    
    console.log('🧪 Starting Advanced Email Deliverability Tests')
    console.log('Test Target:', testEmail)
    console.log('Configuration:', {
      service: EMAIL_CONFIG.SERVICE,
      user: EMAIL_CONFIG.USER,
      from: EMAIL_CONFIG.FROM_EMAIL,
      smtp: `${EMAIL_CONFIG.SMTP_HOST}:${EMAIL_CONFIG.SMTP_PORT}`,
      secure: EMAIL_CONFIG.SMTP_SECURE
    })
    
    const results: any[] = []
    
    // Test 1: Basic SMTP Connection
    console.log('\n📡 Test 1: SMTP Connection Verification')
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_CONFIG.USER,
          pass: EMAIL_CONFIG.PASS
        }
      })
      
      await transporter.verify()
      results.push({
        test: 'SMTP Connection',
        status: 'PASS',
        message: 'Gmail SMTP connection verified successfully',
        details: 'Authentication and server connection working'
      })
      console.log('✅ SMTP Connection: PASS')
    } catch (error: any) {
      results.push({
        test: 'SMTP Connection', 
        status: 'FAIL',
        message: error.message,
        details: 'Check Gmail credentials and app password'
      })
      console.log('❌ SMTP Connection: FAIL -', error.message)
    }
    
    // Test 2: Simple Plain Text Email
    console.log('\n📧 Test 2: Simple Plain Text Email')
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_CONFIG.USER,
          pass: EMAIL_CONFIG.PASS
        }
      })
      
      const mailOptions = {
        from: EMAIL_CONFIG.FROM_EMAIL,
        to: testEmail,
        subject: `[ARIS TEST] Plain Text Email - ${new Date().toLocaleTimeString()}`,
        text: 'This is a simple plain text test email from ARIS system. If you receive this, basic email delivery is working.'
      }
      
      const result = await transporter.sendMail(mailOptions)
      results.push({
        test: 'Plain Text Email',
        status: 'SENT',
        message: 'Plain text email sent successfully',
        messageId: result.messageId,
        details: `Sent to ${testEmail} at ${new Date().toISOString()}`
      })
      console.log('✅ Plain Text Email: SENT -', result.messageId)
    } catch (error: any) {
      results.push({
        test: 'Plain Text Email',
        status: 'FAIL',
        message: error.message,
        details: 'Failed to send plain text email'
      })
      console.log('❌ Plain Text Email: FAIL -', error.message)
    }
    
    if (runAllTests) {
      // Test 3: HTML Email with Enhanced Headers
      console.log('\n🎨 Test 3: HTML Email with Enhanced Headers')
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_CONFIG.USER,
            pass: EMAIL_CONFIG.PASS
          }
        })
        
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ARIS Test Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">🧪 ARIS Email Deliverability Test</h2>
        <p>This is an HTML test email from the ARIS HR Intelligence System.</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Test Details:</strong></p>
            <ul>
                <li>Sent at: ${new Date().toISOString()}</li>
                <li>From: ${EMAIL_CONFIG.FROM_EMAIL}</li>
                <li>To: ${testEmail}</li>
                <li>Type: HTML with enhanced headers</li>
            </ul>
        </div>
        <p>If you receive this email, HTML email delivery is working correctly.</p>
        <p>Best regards,<br>ARIS Development Team</p>
    </div>
</body>
</html>
        `
        
        const mailOptions = {
          from: {
            name: EMAIL_CONFIG.FROM_NAME,
            address: EMAIL_CONFIG.FROM_EMAIL
          },
          to: testEmail,
          subject: `[ARIS TEST] HTML Email with Headers - ${new Date().toLocaleTimeString()}`,
          text: 'This is the plain text version of the ARIS HTML test email.',
          html: htmlContent,
          headers: {
            'X-Mailer': 'ARIS Test Suite v1.0',
            'X-Priority': '3 (Normal)',
            'Importance': 'normal',
            'Return-Path': EMAIL_CONFIG.FROM_EMAIL,
            'Reply-To': EMAIL_CONFIG.FROM_EMAIL,
            'Organization': 'ARIS HR Intelligence',
            'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN'
          }
        }
        
        const result = await transporter.sendMail(mailOptions)
        results.push({
          test: 'HTML Email with Headers',
          status: 'SENT',
          message: 'HTML email with enhanced headers sent successfully',
          messageId: result.messageId,
          details: `Enhanced HTML email sent to ${testEmail}`
        })
        console.log('✅ HTML Email: SENT -', result.messageId)
      } catch (error: any) {
        results.push({
          test: 'HTML Email with Headers',
          status: 'FAIL',
          message: error.message,
          details: 'Failed to send HTML email'
        })
        console.log('❌ HTML Email: FAIL -', error.message)
      }
      
      // Test 4: Email to Different Domain (if different)
      if (!testEmail.includes('karanji.com')) {
        console.log('\n🌐 Test 4: Cross-Domain Email Test')
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: EMAIL_CONFIG.USER,
              pass: EMAIL_CONFIG.PASS
            }
          })
          
          const mailOptions = {
            from: EMAIL_CONFIG.FROM_EMAIL,
            to: 'test@gmail.com', // Safe test address
            subject: `[ARIS TEST] Cross-Domain Test - ${new Date().toLocaleTimeString()}`,
            text: 'This is a cross-domain delivery test from ARIS system.'
          }
          
          const result = await transporter.sendMail(mailOptions)
          results.push({
            test: 'Cross-Domain Email',
            status: 'SENT',
            message: 'Cross-domain email sent successfully',
            messageId: result.messageId,
            details: 'Email sent to different domain'
          })
          console.log('✅ Cross-Domain Email: SENT -', result.messageId)
        } catch (error: any) {
          results.push({
            test: 'Cross-Domain Email',
            status: 'FAIL',
            message: error.message,
            details: 'Failed to send cross-domain email'
          })
          console.log('❌ Cross-Domain Email: FAIL -', error.message)
        }
      }
    }
    
    // Test 5: Gmail Account Settings Check
    console.log('\n⚙️ Test 5: Gmail Account Configuration')
    try {
      // This is informational - we can't actually check Gmail settings via API
      // but we can provide guidance
      results.push({
        test: 'Gmail Configuration',
        status: 'INFO',
        message: 'Gmail account configuration checklist',
        details: [
          '✓ Ensure 2-Factor Authentication is enabled',
          '✓ Generate App Password (not regular password)',
          '✓ Check Gmail sending limits (500 emails/day)',
          '✓ Verify account is not flagged for spam',
          '✓ Check if Less Secure Apps is properly configured'
        ]
      })
      console.log('ℹ️ Gmail Configuration: INFO - Checklist provided')
    } catch (error: any) {
      console.log('❌ Gmail Configuration: ERROR -', error.message)
    }
    
    // Test 6: Check Email Content for Spam Triggers
    console.log('\n🛡️ Test 6: Spam Filter Analysis')
    try {
      const spamTriggers = [
        'FREE', 'URGENT', 'CLICK HERE', 'LIMITED TIME', 'ACT NOW',
        'CONGRATULATIONS', 'WINNER', 'CASH', 'MONEY', 'GUARANTEE'
      ]
      
      const testSubject = `[ARIS TEST] HTML Email with Headers - ${new Date().toLocaleTimeString()}`
      const testContent = 'This is the plain text version of the ARIS HTML test email.'
      
      const triggersFound = spamTriggers.filter(trigger => 
        testSubject.toUpperCase().includes(trigger) || 
        testContent.toUpperCase().includes(trigger)
      )
      
      results.push({
        test: 'Spam Filter Analysis',
        status: triggersFound.length === 0 ? 'PASS' : 'WARNING',
        message: triggersFound.length === 0 ? 'No obvious spam triggers detected' : `${triggersFound.length} potential spam triggers found`,
        details: triggersFound.length === 0 ? 'Email content looks good' : `Triggers: ${triggersFound.join(', ')}`
      })
      console.log(`🛡️ Spam Analysis: ${triggersFound.length === 0 ? 'PASS' : 'WARNING'} - ${triggersFound.length} triggers found`)
    } catch (error: any) {
      console.log('❌ Spam Analysis: ERROR -', error.message)
    }
    
    console.log('\n✅ Advanced Email Testing Complete')
    console.log('Total Tests:', results.length)
    console.log('Passed:', results.filter(r => r.status === 'PASS' || r.status === 'SENT').length)
    console.log('Failed:', results.filter(r => r.status === 'FAIL').length)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      testTarget: testEmail,
      configuration: {
        service: EMAIL_CONFIG.SERVICE,
        user: EMAIL_CONFIG.USER,
        from: EMAIL_CONFIG.FROM_EMAIL,
        smtp: `${EMAIL_CONFIG.SMTP_HOST}:${EMAIL_CONFIG.SMTP_PORT}`
      },
      results,
      summary: {
        total: results.length,
        passed: results.filter(r => r.status === 'PASS' || r.status === 'SENT').length,
        failed: results.filter(r => r.status === 'FAIL').length,
        warnings: results.filter(r => r.status === 'WARNING').length
      },
      recommendations: [
        'Check recipient\'s spam/junk folder',
        'Verify recipient email address is correct',
        'Ensure Gmail account has not hit daily sending limits',
        'Consider setting up SPF/DKIM records for better deliverability',
        'Test with different email providers (Gmail, Outlook, Yahoo)',
        'Check if emails are being delayed rather than lost'
      ]
    })
    
  } catch (error) {
    console.error('❌ Advanced Email Test Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Advanced email test failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/email-test-advanced
 * Get email testing information and tips
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'ARIS Advanced Email Testing Endpoint',
    usage: {
      method: 'POST',
      body: {
        testEmail: 'recipient@domain.com (optional, defaults to shivani@karanji.com)',
        runAllTests: 'boolean (optional, defaults to true)'
      }
    },
    tests: [
      'SMTP Connection Verification',
      'Plain Text Email Delivery',
      'HTML Email with Enhanced Headers',
      'Cross-Domain Email Test',
      'Gmail Configuration Check',
      'Spam Filter Analysis'
    ],
    troubleshooting: {
      'Email not received': [
        'Check spam/junk folder',
        'Verify email address is correct',
        'Check Gmail sending limits',
        'Test with different email provider'
      ],
      'Authentication failed': [
        'Enable 2-Factor Authentication on Gmail',
        'Generate App Password (not regular password)',
        'Update EMAIL_PASS in .env.local',
        'Verify EMAIL_USER is correct'
      ],
      'Message rejected': [
        'Check email content for spam triggers',
        'Verify recipient domain accepts emails',
        'Check if sender domain is blacklisted',
        'Consider setting up SPF/DKIM records'
      ]
    }
  })
}
