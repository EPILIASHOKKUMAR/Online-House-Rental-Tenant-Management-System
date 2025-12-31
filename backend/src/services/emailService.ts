import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env and .env.local
dotenv.config();
dotenv.config({ path: '.env.local' });

// Email configuration
const emailConfig = {
  service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email service error:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'House Rental System',
        address: process.env.SMTP_USER || process.env.EMAIL_USER
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};

export const sendPasswordResetEmail = async (
  email: string, 
  resetToken: string, 
  userName: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - House Rental System</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 32px;
                margin-bottom: 20px;
            }
            h1 {
                color: #2d3748;
                margin: 0;
                font-size: 28px;
            }
            .content {
                margin: 30px 0;
            }
            .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            .reset-button:hover {
                transform: translateY(-2px);
            }
            .token-box {
                background: #f7fafc;
                border: 2px dashed #667eea;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
            }
            .token {
                font-family: 'Courier New', monospace;
                font-size: 18px;
                font-weight: bold;
                color: #667eea;
                letter-spacing: 2px;
            }
            .warning {
                background: #fff5f5;
                border-left: 4px solid #f56565;
                padding: 15px;
                margin: 20px 0;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #718096;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠</div>
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
                <p>Hello <strong>${userName}</strong>,</p>
                
                <p>We received a request to reset your password for your House Rental System account. If you didn't make this request, you can safely ignore this email.</p>
                
                <p>To reset your password, you have two options:</p>
                
                <h3>Option 1: Click the Reset Link</h3>
                <p>Click the button below to reset your password:</p>
                <div style="text-align: center;">
                    <a href="${resetUrl}" class="reset-button">Reset My Password</a>
                </div>
                
                <h3>Option 2: Use the Reset Token</h3>
                <p>If the button doesn't work, you can manually enter this reset token on our website:</p>
                <div class="token-box">
                    <div class="token">${resetToken}</div>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong>
                    <ul>
                        <li>This reset token will expire in <strong>1 hour</strong></li>
                        <li>For security reasons, you can only use this token once</li>
                        <li>If you didn't request this reset, please contact our support team</li>
                    </ul>
                </div>
                
                <p>If you're having trouble with the reset link, copy and paste this URL into your browser:</p>
                <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            </div>
            
            <div class="footer">
                <p>This email was sent from House Rental System</p>
                <p>If you have any questions, please contact our support team.</p>
                <p><small>This is an automated message, please do not reply to this email.</small></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
    Password Reset Request - House Rental System
    
    Hello ${userName},
    
    We received a request to reset your password for your House Rental System account.
    
    Reset Token: ${resetToken}
    Reset Link: ${resetUrl}
    
    This token will expire in 1 hour.
    
    If you didn't request this reset, please ignore this email.
    
    Best regards,
    House Rental System Team
  `;

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request - House Rental System',
    html: htmlContent,
    text: textContent
  });
};

export default { sendEmail, sendPasswordResetEmail };