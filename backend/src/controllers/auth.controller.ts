import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (!['owner', 'tenant', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be owner, tenant, or admin' });
    }

    // Check if email already exists and get the role
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, role FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      const existingRole = existing[0].role;
      return res.status(409).json({ 
        error: `Email already registered as ${existingRole}`,
        details: {
          email: email,
          existingRole: existingRole,
          message: `This email is already registered with the role: ${existingRole}. Please use a different email or login with existing credentials.`
        }
      });
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

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone || null, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, phone, role, profile_photo FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // User exists, return user data
      const user = existing[0];
      return res.json({
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
    }

    // Create new user with Google login
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, role, google_id) VALUES (?, ?, ?, ?)',
      [name, email, 'tenant', googleId]
    );

    res.status(201).json({
      message: 'User registered and logged in successfully',
      user: {
        id: result.insertId,
        name: name,
        email: email,
        role: 'tenant'
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to process Google login' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const user = users[0];

    // Generate a simple reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in database
    await pool.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id]
    );

    // In a real application, you would send an email here
    // For now, we'll return the reset token (for development/testing)
    res.json({
      message: 'Password reset instructions sent to your email',
      // Remove this in production - only for development
      resetToken: resetToken,
      email: email,
      instructions: 'Use the reset token to reset your password'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find user with valid reset token
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, email FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = users[0];

    // Update password and clear reset token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [newPassword, user.id]
    );

    res.json({
      message: 'Password reset successful. You can now login with your new password.',
      email: user.email
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
