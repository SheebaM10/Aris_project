/**
 * Simple Email Test API - /api/simple-email-test
 * 
 * Sends a basic test email to verify deliverability
 * Use this to test email delivery to different addresses
 */

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const EMAIL_CONFIG = {
  USER: process.env.EMAIL_USER || 'karanjibuddy@gmail.com',
  PASS: process.env.EMAIL_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'karanjibuddy@gmail.com',
  FROM_NAME: process.env.FROM_NAME || 'ARIS Workforce Intelligence',
}

export async function POST(request: NextRequest) {
  try {
    const { to, testType = 'basic' } = await request.json()
    
    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Email address required' },
        { status: 400 }
      )
    }

    console.log('🧪 Simple Email Test Starting')
    console.log('To:', to)
    console.log('Test Type:', testType)
    console.log('From:', EMAIL_CONFIG.FROM_EMAIL)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_CONFIG.USER,
        pass: EMAIL_CONFIG.PASS
      }
    })

    // Verify connection
    await transporter.verify()
    console.log('✅ SMTP Connection Verified')

    let subject = ''
    let content = ''

    switch (testType) {
      case 'plain':
        subject = `Test Email from ARIS - ${new Date().toLocaleTimeString()}`
        content = `Hello!\n\nThis is a simple test email from the ARIS Workforce Intelligence system.\n\nSent at: ${new Date().toISOString()}\nFrom: ${EMAIL_CONFIG.FROM_EMAIL}\nTo: ${to}\n\nIf you receive this email, basic email delivery is working correctly.\n\nBest regards,\nARIS Team`
        break
      
      case 'professional':
        subject = `Project Communication - ${new Date().toLocaleDateString()}`
        content = `Dear Team Member,\n\nThis is a test communication from the ARIS Workforce Intelligence platform.\n\nWe are verifying that our email delivery system is functioning correctly for project updates and team communications.\n\nTest Details:\n- Sent: ${new Date().toISOString()}\n- System: ARIS Workforce Intelligence\n- Purpose: Email delivery verification\n\nPlease confirm receipt of this email.\n\nBest regards,\nARIS Development Team\nWorkforce Intelligence Division`
        break
      
      default: // basic
        subject = `ARIS System Test - ${new Date().toLocaleTimeString()}`
        content = `This is a basic test email from ARIS.\n\nTime: ${new Date().toISOString()}\nStatus: Testing email delivery\n\nIf you receive this, the email system is working.\n\nRegards,\nARIS System`
    }

    const mailOptions = {
      from: {
        name: EMAIL_CONFIG.FROM_NAME,
        address: EMAIL_CONFIG.FROM_EMAIL
      },
      to: to,
      subject: subject,
      text: content,
      headers: {
        'X-Mailer': 'ARIS Test Suite',
        'X-Priority': '3',
        'Reply-To': EMAIL_CONFIG.FROM_EMAIL,
        'Return-Path': EMAIL_CONFIG.FROM_EMAIL
      }
    }

    console.log('📤 Sending test email...')
    console.log('Subject:', subject)
    
    const result = await transporter.sendMail(mailOptions)
    
    console.log('✅ Test Email Sent Successfully!')
    console.log('Message ID:', result.messageId)
    console.log('Response:', result.response)

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        messageId: result.messageId,
        to: to,
        subject: subject,
        sentAt: new Date().toISOString(),
        testType: testType,
        from: EMAIL_CONFIG.FROM_EMAIL,
        response: result.response
      },
      instructions: {
        checkSpam: 'If email not received, check spam/junk folder',
        timeframe: 'Email should arrive within 1-5 minutes',
        troubleshooting: 'See EMAIL_DELIVERY_TROUBLESHOOTING.md for help'
      }
    })

  } catch (error: any) {
    console.error('❌ Simple Email Test Failed:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        troubleshooting: {
          authError: 'Check Gmail app password in .env.local',
          connectionError: 'Verify internet connection and Gmail SMTP access',
          messageError: 'Check email address format and content'
        }
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'ARIS Simple Email Test API',
    usage: {
      method: 'POST',
      body: {
        to: 'recipient@domain.com (required)',
        testType: '"basic", "plain", or "professional" (optional, default: basic)'
      },
      examples: [
        {
          description: 'Basic test email',
          body: { to: 'test@gmail.com' }
        },
        {
          description: 'Plain text test',
          body: { to: 'test@gmail.com', testType: 'plain' }
        },
        {
          description: 'Professional test',
          body: { to: 'test@gmail.com', testType: 'professional' }
        }
      ]
    },
    testTypes: {
      basic: 'Simple system test email',
      plain: 'Detailed plain text test email',
      professional: 'Professional communication style test'
    }
  })
}
