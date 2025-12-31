import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;
    
    let query = 'SELECT id, name, email, phone, role, created_at FROM users';
    const params: any[] = [];
    
    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [users] = await pool.query<RowDataPacket[]>(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [userCounts] = await pool.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as totalUsers,
        SUM(CASE WHEN role = 'owner' THEN 1 ELSE 0 END) as totalOwners,
        SUM(CASE WHEN role = 'tenant' THEN 1 ELSE 0 END) as totalTenants
      FROM users
    `);

    const [propertyCounts] = await pool.query<RowDataPacket[]>(`
      SELECT 
        COUNT(*) as totalProperties,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as availableProperties
      FROM properties
    `);

    const [bookingCounts] = await pool.query<RowDataPacket[]>(`
      SELECT 
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingBookings,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approvedBookings,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejectedBookings
      FROM bookings
    `);

    res.json({
      totalUsers: userCounts[0].totalUsers || 0,
      totalOwners: userCounts[0].totalOwners || 0,
      totalTenants: userCounts[0].totalTenants || 0,
      totalProperties: propertyCounts[0].totalProperties || 0,
      availableProperties: propertyCounts[0].availableProperties || 0,
      pendingBookings: bookingCounts[0].pendingBookings || 0,
      approvedBookings: bookingCounts[0].approvedBookings || 0,
      rejectedBookings: bookingCounts[0].rejectedBookings || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM users WHERE id = ? AND role != "admin"',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or cannot delete admin' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT b.*, 
        p.title as property_title, p.location, p.rent,
        t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone,
        o.name as owner_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users t ON b.tenant_id = t.id
      JOIN users o ON p.owner_id = o.id
    `;
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE b.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.request_time DESC';
    
    const [bookings] = await pool.query<RowDataPacket[]>(query, params);
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getAllPropertiesAdmin = async (req: Request, res: Response) => {
  try {
    const [properties] = await pool.query<RowDataPacket[]>(`
      SELECT p.id, p.owner_id, p.title, p.description, p.rent, p.location, p.city, p.state, p.pincode,
        p.property_type, p.bhk, p.furnishing, p.area, p.floor_number, p.amenities, p.photos, p.status, p.created_at,
        u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(properties);
  } catch (error: any) {
    console.error('Get all properties error:', error.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};
