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
