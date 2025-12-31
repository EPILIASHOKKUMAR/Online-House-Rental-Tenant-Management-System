import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { property_id, tenant_id, message } = req.body;

    if (!property_id) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!tenant_id) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const [properties] = await pool.query<RowDataPacket[]>(
      'SELECT id, status, owner_id FROM properties WHERE id = ?',
      [property_id]
    );

    if (properties.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (properties[0].status !== 'available') {
      return res.status(400).json({ error: 'Property is not available for booking' });
    }

    const [existingBookings] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM bookings WHERE property_id = ? AND tenant_id = ? AND status = "pending"',
      [property_id, tenant_id]
    );

    if (existingBookings.length > 0) {
      return res.status(409).json({ error: 'You already have a pending booking for this property' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO bookings (property_id, tenant_id, message) VALUES (?, ?, ?)',
      [property_id, tenant_id, message || null]
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`owner-${properties[0].owner_id}`).emit('new-booking', {
        bookingId: result.insertId,
        propertyId: property_id,
        tenantId: tenant_id,
        message: 'New booking request received'
      });
    }

    res.status(201).json({
      message: 'Booking request submitted successfully',
      bookingId: result.insertId
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking request' });
  }
};

export const getTenantBookings = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const [bookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, 
        p.title as property_title, p.location, p.rent, p.photos,
        u.name as owner_name, u.phone as owner_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON p.owner_id = u.id
       WHERE b.tenant_id = ?
       ORDER BY b.request_time DESC`,
      [tenantId]
    );

    res.json(bookings);
  } catch (error) {
    console.error('Get tenant bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;
    const { status } = req.query;

    let query = `
      SELECT b.*, 
        p.title as property_title, p.location, p.rent,
        t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users t ON b.tenant_id = t.id
       WHERE p.owner_id = ?
    `;
    const params: any[] = [ownerId];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.request_time DESC';

    const [bookings] = await pool.query<RowDataPacket[]>(query, params);
    res.json(bookings);
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: pending, approved, rejected' 
      });
    }

    const [bookingData] = await pool.query<RowDataPacket[]>(
      `SELECT b.tenant_id, b.property_id, p.title as property_title 
       FROM bookings b 
       JOIN properties p ON b.property_id = p.id 
       WHERE b.id = ?`,
      [id]
    );

    if (bookingData.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE bookings SET status = ?, response_time = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (status === 'approved') {
      await pool.query(
        'UPDATE properties SET status = "rented" WHERE id = ?',
        [bookingData[0].property_id]
      );

      await pool.query(
        'UPDATE bookings SET status = "rejected", response_time = NOW() WHERE property_id = ? AND id != ? AND status = "pending"',
        [bookingData[0].property_id, id]
      );
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`tenant-${bookingData[0].tenant_id}`).emit('booking-status-update', {
        bookingId: parseInt(id),
        status: status,
        propertyTitle: bookingData[0].property_title,
        message: `Your booking for "${bookingData[0].property_title}" has been ${status}`
      });
    }

    res.json({ message: `Booking ${status} successfully` });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, 
        p.title as property_title, p.location, p.rent, p.photos, p.amenities,
        t.name as tenant_name, t.email as tenant_email, t.phone as tenant_phone,
        o.name as owner_name, o.email as owner_email, o.phone as owner_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users t ON b.tenant_id = t.id
       JOIN users o ON p.owner_id = o.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(bookings[0]);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM bookings WHERE id = ? AND status = "pending"',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found or cannot be cancelled' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
