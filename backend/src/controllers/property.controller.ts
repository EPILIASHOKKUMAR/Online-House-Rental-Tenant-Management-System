import { Request, Response } from 'express';
import pool from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const { location, maxBudget, amenity, status } = req.query;
    
    let query = `
      SELECT p.id, p.owner_id, p.title, p.description, p.rent, p.location, p.city, p.state, p.pincode,
        p.property_type, p.bhk, p.furnishing, p.area, p.floor_number, p.amenities, p.status, p.created_at,
        p.latitude, p.longitude,
        u.name as owner_name, u.phone as owner_phone, u.email as owner_email,
        (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'approved') as is_booked
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (location) {
      query += ' AND (p.location LIKE ? OR p.city LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    if (maxBudget) {
      query += ' AND p.rent <= ?';
      params.push(Number(maxBudget));
    }

    if (amenity) {
      query += ' AND JSON_CONTAINS(p.amenities, ?)';
      params.push(JSON.stringify(amenity));
    }

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC';

    const [properties] = await pool.query<RowDataPacket[]>(query, params);
    
    for (let prop of properties) {
      prop.isBooked = prop.is_booked > 0;
      delete prop.is_booked;
      
      try {
        const [photoResult] = await pool.query<RowDataPacket[]>(
          'SELECT photos FROM properties WHERE id = ? LIMIT 1',
          [prop.id]
        );
        if (photoResult.length > 0 && photoResult[0].photos) {
          const photos = typeof photoResult[0].photos === 'string' 
            ? JSON.parse(photoResult[0].photos) 
            : photoResult[0].photos;
          prop.photos = photos.length > 0 ? [photos[0]] : [];
        } else {
          prop.photos = [];
        }
      } catch {
        prop.photos = [];
      }
    }
    
    res.json(properties);
  } catch (error: any) {
    console.error('Get properties error:', error.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, p.latitude, p.longitude, u.name as owner_name, u.phone as owner_phone, u.email as owner_email
       FROM properties p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    if (properties.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = properties[0];

    const [approvedBookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.id, b.tenant_id, u.name as tenant_name 
       FROM bookings b 
       JOIN users u ON b.tenant_id = u.id
       WHERE b.property_id = ? AND b.status = 'approved'
       LIMIT 1`,
      [id]
    );

    property.isBooked = approvedBookings.length > 0;
    property.bookedBy = approvedBookings.length > 0 ? approvedBookings[0].tenant_name : null;

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { 
      owner_id, title, description, rent, location, city, state, pincode,
      property_type, bhk, furnishing, area, floor_number,
      amenities, photos, contact_name, contact_phone, contact_email,
      latitude, longitude
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Property title is required' });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ error: 'Location is required' });
    }

    if (!rent || rent <= 0) {
      return res.status(400).json({ error: 'Rent amount must be greater than zero' });
    }

    if (!owner_id) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO properties (
        owner_id, title, description, rent, location, city, state, pincode,
        property_type, bhk, furnishing, area, floor_number,
        amenities, photos, contact_name, contact_phone, contact_email,
        latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        owner_id,
        title.trim(),
        description || null,
        rent,
        location.trim(),
        city || null,
        state || null,
        pincode || null,
        property_type || null,
        bhk || null,
        furnishing || null,
        area || null,
        floor_number || null,
        JSON.stringify(amenities || []),
        JSON.stringify(photos || []),
        contact_name || null,
        contact_phone || null,
        contact_email || null,
        latitude || null,
        longitude || null
      ]
    );

    res.status(201).json({
      message: 'Property created successfully',
      propertyId: result.insertId
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, description, rent, location, city, state, pincode,
      property_type, bhk, furnishing, area, floor_number,
      amenities, photos, contact_name, contact_phone, contact_email, status 
    } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'Property title cannot be empty' });
    }

    if (location !== undefined && !location.trim()) {
      return res.status(400).json({ error: 'Location cannot be empty' });
    }

    if (rent !== undefined && rent <= 0) {
      return res.status(400).json({ error: 'Rent amount must be greater than zero' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (title) { updates.push('title = ?'); params.push(title.trim()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (rent) { updates.push('rent = ?'); params.push(rent); }
    if (location) { updates.push('location = ?'); params.push(location.trim()); }
    if (city !== undefined) { updates.push('city = ?'); params.push(city); }
    if (state !== undefined) { updates.push('state = ?'); params.push(state); }
    if (pincode !== undefined) { updates.push('pincode = ?'); params.push(pincode); }
    if (property_type !== undefined) { updates.push('property_type = ?'); params.push(property_type); }
    if (bhk !== undefined) { updates.push('bhk = ?'); params.push(bhk); }
    if (furnishing !== undefined) { updates.push('furnishing = ?'); params.push(furnishing); }
    if (area !== undefined) { updates.push('area = ?'); params.push(area); }
    if (floor_number !== undefined) { updates.push('floor_number = ?'); params.push(floor_number); }
    if (amenities) { updates.push('amenities = ?'); params.push(JSON.stringify(amenities)); }
    if (photos) { updates.push('photos = ?'); params.push(JSON.stringify(photos)); }
    if (contact_name !== undefined) { updates.push('contact_name = ?'); params.push(contact_name); }
    if (contact_phone !== undefined) { updates.push('contact_phone = ?'); params.push(contact_phone); }
    if (contact_email !== undefined) { updates.push('contact_email = ?'); params.push(contact_email); }
    if (status) { updates.push('status = ?'); params.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE properties SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM properties WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

export const getPropertiesByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.params;

    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT id, owner_id, title, description, rent, location, city, state, pincode,
        property_type, bhk, furnishing, area, floor_number, amenities, status, created_at,
        (SELECT COUNT(*) FROM bookings b WHERE b.property_id = properties.id AND b.status = 'pending') as pending_requests
       FROM properties
       WHERE owner_id = ?
       ORDER BY created_at DESC`,
      [ownerId]
    );

    for (let prop of properties) {
      try {
        const [photoResult] = await pool.query<RowDataPacket[]>(
          'SELECT photos FROM properties WHERE id = ? LIMIT 1',
          [prop.id]
        );
        if (photoResult.length > 0 && photoResult[0].photos) {
          const photos = typeof photoResult[0].photos === 'string' 
            ? JSON.parse(photoResult[0].photos) 
            : photoResult[0].photos;
          prop.photos = photos.length > 0 ? [photos[0]] : [];
        } else {
          prop.photos = [];
        }
      } catch {
        prop.photos = [];
      }
    }

    res.json(properties);
  } catch (error: any) {
    console.error('Get owner properties error:', error.message);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};
