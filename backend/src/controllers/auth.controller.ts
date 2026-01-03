import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import nodemailer from 'nodemailer';

const otpStore: Map<string, { otp: string; expires: number }> = new Map();

const getTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || '587');
  const isSecure = port === 465;
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const otp = generateOTP();
    otpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 });

    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"House Rental" <${process.env.SMTP_FROM || 'exploreai45@gmail.com'}>`,
      to: email,
      subject: 'Password Reset OTP - House Rental',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #667eea; text-align: center;">Password Reset Request</h2>
          <p>Hello ${users[0].name},</p>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
            <h1 style="margin: 0; letter-spacing: 8px; font-size: 32px;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP is valid for 10 minutes.</p>
          <p style="color: #666;">If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">House Rental Platform</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'OTP sent to your email' });
  } catch (error: any) {
    console.error('Forgot password error:', error.message || error);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData) {
      return res.status(400).json({ error: 'OTP expired or not found. Please request a new one.' });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP and new password are required' });
    }

    const storedData = otpStore.get(email);

    if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE email = ?',
      [newPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    otpStore.delete(email);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (!['owner', 'tenant', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be owner, tenant, or admin' });
    }

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, phone || null, role || 'tenant']
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, profile_photo FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_photo: user.profile_photo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { credential, role } = req.body;

    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    const base64Payload = credential.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
    
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Email not found in Google account' });
    }

    const [existingUsers] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, profile_photo FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (existingUsers.length > 0) {
      user = existingUsers[0];
      
      if (!user.profile_photo && picture) {
        await pool.query('UPDATE users SET profile_photo = ? WHERE id = ?', [picture, user.id]);
        user.profile_photo = picture;
      }
    } else {
      const userRole = role || 'tenant';
      const randomPassword = 'google_' + googleId + '_' + Date.now();
      
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (name, email, password, role, profile_photo) VALUES (?, ?, ?, ?, ?)',
        [name, email, randomPassword, userRole, picture || null]
      );

      user = {
        id: result.insertId,
        name,
        email,
        phone: null,
        role: userRole,
        profile_photo: picture || null
      };
    }

    res.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_photo: user.profile_photo
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to login with Google' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, profile_photo, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { profile_photo } = req.body;

    if (!profile_photo) {
      return res.status(400).json({ error: 'Profile photo is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET profile_photo = ? WHERE id = ?',
      [profile_photo, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile photo updated successfully' });
  } catch (error) {
    console.error('Update profile photo error:', error);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
};
