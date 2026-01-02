import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pool from '../config/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function checkAIConnection() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.log('\n========================================');
      console.log('   🤖 AI CHATBOT STATUS');
      console.log('========================================');
      console.log('❌ GEMINI AI: API key not configured');
      console.log('========================================\n');
      return false;
    }
    
    console.log('\n========================================');
    console.log('   🤖 AI CHATBOT STATUS');
    console.log('========================================');
    console.log('✅ Gemini AI API Key Configured');
    console.log('✅ Model: gemini-2.5-flash');
    console.log('✅ Chatbot is ready to use');
    console.log('========================================\n');
    return true;
  } catch (error: any) {
    console.log('\n========================================');
    console.log('   🤖 AI CHATBOT STATUS');
    console.log('========================================');
    console.log('❌ Gemini AI Connection Failed!');
    console.log('Error:', error.message);
    console.log('========================================\n');
    return false;
  }
}

async function getDatabaseStats() {
  try {
    const conn = await pool.getConnection();
    
    const [totalProps]: any = await conn.query('SELECT COUNT(*) as count FROM properties');
    const [propsByCity]: any = await conn.query('SELECT city, COUNT(*) as count FROM properties GROUP BY city ORDER BY count DESC');
    const [propsByType]: any = await conn.query('SELECT property_type, COUNT(*) as count FROM properties GROUP BY property_type');
    const [availableProps]: any = await conn.query("SELECT COUNT(*) as count FROM properties WHERE status = 'available'");
    const [usersByRole]: any = await conn.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const [bookingStats]: any = await conn.query('SELECT status, COUNT(*) as count FROM bookings GROUP BY status');
    const [priceRange]: any = await conn.query('SELECT MIN(rent) as min_rent, MAX(rent) as max_rent, AVG(rent) as avg_rent FROM properties');
    const [recentProps]: any = await conn.query("SELECT COUNT(*) as count FROM properties WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    
    conn.release();
    
    return {
      totalProperties: totalProps[0]?.count || 0,
      availableProperties: availableProps[0]?.count || 0,
      propertiesByCity: propsByCity || [],
      propertiesByType: propsByType || [],
      usersByRole: usersByRole || [],
      bookingStats: bookingStats || [],
      priceRange: {
        min: priceRange[0]?.min_rent || 0,
        max: priceRange[0]?.max_rent || 0,
        avg: Math.round(priceRange[0]?.avg_rent || 0)
      },
      recentProperties: recentProps[0]?.count || 0
    };
  } catch (error) {
    console.error('Error fetching database stats:', error);
    return null;
  }
}

async function getPropertiesByCity(city: string) {
  try {
    const conn = await pool.getConnection();
    
    const [properties]: any = await conn.query(
      'SELECT id, title, property_type, rent, bhk, area, status, location FROM properties WHERE LOWER(city) LIKE LOWER(?) LIMIT 20',
      ['%' + city + '%']
    );
    
    const [count]: any = await conn.query(
      'SELECT COUNT(*) as count FROM properties WHERE LOWER(city) LIKE LOWER(?)',
      ['%' + city + '%']
    );
    
    conn.release();
    return { count: count[0]?.count || 0, properties };
  } catch (error) {
    console.error('Error getting properties by city:', error);
    return { count: 0, properties: [] };
  }
}

export const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const dbStats = await getDatabaseStats();
    
    const cityMatch = message.match(/(?:properties|flats|houses|apartments|rooms?|homes?)\s+(?:in|at|near|around)\s+(\w+)/i) ||
                      message.match(/(\w+)\s+(?:properties|flats|houses|apartments|homes?)/i) ||
                      message.match(/how many\s+(?:properties|flats|houses|apartments|homes?)?\s*(?:are\s+)?(?:there\s+)?(?:in|at)?\s*(\w+)/i);
    
    let cityData = null;
    let detectedCity = null;
    
    if (cityMatch) {
      detectedCity = cityMatch[1];
      cityData = await getPropertiesByCity(detectedCity);
    }

    const systemContext = `You are an AI assistant for HouseRental, an online house rental and tenant management platform based in Chennai, India.

CURRENT DATABASE STATISTICS:
- Total Properties: ${dbStats?.totalProperties || 0}
- Available Properties: ${dbStats?.availableProperties || 0}
- Properties by City: ${dbStats?.propertiesByCity?.map((c: any) => c.city + ': ' + c.count).join(', ') || 'No data'}
- Property Types: ${dbStats?.propertiesByType?.map((t: any) => t.property_type + ': ' + t.count).join(', ') || 'No data'}
- Rent Range: Rs.${dbStats?.priceRange?.min || 0} - Rs.${dbStats?.priceRange?.max || 0} (Average: Rs.${dbStats?.priceRange?.avg || 0})
- Users: ${dbStats?.usersByRole?.map((u: any) => u.role + ': ' + u.count).join(', ') || 'No data'}
- Booking Status: ${dbStats?.bookingStats?.map((b: any) => b.status + ': ' + b.count).join(', ') || 'No data'}

${cityData ? 'SPECIFIC CITY DATA FOR "' + detectedCity?.toUpperCase() + '":\n- Total Properties in ' + detectedCity + ': ' + cityData.count + '\n- Property Details: ' + (cityData.properties.length > 0 ? cityData.properties.map((p: any) => p.title + ' - ' + p.property_type + ', Rs.' + p.rent + '/month, ' + p.bhk + ' BHK').join('; ') : 'No properties found') : ''}

PLATFORM INFORMATION:
- Website: HouseRental - Online House Rental & Tenant Management System
- Location: Chennai, India
- Contact: support@houserental.com

USER ROLES:
1. TENANT: Browse properties, submit booking requests, track request status
2. OWNER: List properties, manage listings, approve/reject booking requests  
3. ADMIN: System-level access to monitor users, properties, and platform activity

BOOKING PROCESS:
1. Tenant browses and selects a property
2. Tenant submits a booking request
3. Owner receives and reviews the request
4. Owner approves or rejects
5. Tenant gets notified of the decision

INSTRUCTIONS:
- Always provide accurate data from the statistics above
- Be helpful, friendly, and professional
- Keep responses concise but informative
- Use Indian Rupee (Rs.) for prices`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        response: getFallbackResponse(message, dbStats, cityData, detectedCity),
        stats: { totalProperties: dbStats?.totalProperties || 0, availableProperties: dbStats?.availableProperties || 0 }
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = systemContext + '\n\nUser Question: ' + message + '\n\nPlease provide a helpful response based on the data above. Be conversational and friendly.';
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ 
      response,
      stats: { totalProperties: dbStats?.totalProperties || 0, availableProperties: dbStats?.availableProperties || 0 }
    });

  } catch (error: any) {
    console.error('Chatbot error:', error.message);
    const dbStats = await getDatabaseStats();
    
    const cityMatch = req.body.message?.match(/(?:properties|flats|houses|apartments|rooms?|homes?)\s+(?:in|at|near|around)\s+(\w+)/i) ||
                      req.body.message?.match(/(\w+)\s+(?:properties|flats|houses|apartments|homes?)/i);
    let cityData = null;
    let detectedCity = null;
    if (cityMatch) {
      detectedCity = cityMatch[1];
      cityData = await getPropertiesByCity(detectedCity);
    }
    
    res.json({ 
      response: getFallbackResponse(req.body.message || '', dbStats, cityData, detectedCity),
      stats: { totalProperties: dbStats?.totalProperties || 0, availableProperties: dbStats?.availableProperties || 0 }
    });
  }
};

function getFallbackResponse(message: string, dbStats: any, cityData: any, detectedCity: string | null): string {
  const lowerMessage = message.toLowerCase();
  
  if (cityData && detectedCity) {
    if (cityData.count > 0) {
      let response = 'There are ' + cityData.count + ' properties available in ' + detectedCity + '.';
      if (cityData.properties.length > 0) {
        const types = [...new Set(cityData.properties.map((p: any) => p.property_type))].filter(Boolean);
        if (types.length > 0) response += ' Types: ' + types.join(', ') + '.';
        const rents = cityData.properties.map((p: any) => p.rent).filter(Boolean);
        if (rents.length > 0) response += ' Rent: Rs.' + Math.min(...rents) + ' - Rs.' + Math.max(...rents) + '/month.';
      }
      return response;
    } else {
      const cities = dbStats?.propertiesByCity?.map((c: any) => c.city).filter(Boolean).join(', ') || 'various locations';
      return 'No properties in ' + detectedCity + '. We have ' + (dbStats?.totalProperties || 0) + ' properties in: ' + cities + '.';
    }
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! Welcome to HouseRental. We have ' + (dbStats?.totalProperties || 0) + ' properties listed across ' + (dbStats?.propertiesByCity?.length || 0) + ' cities. How can I help you?';
  }
  
  if (lowerMessage.includes('how many') && (lowerMessage.includes('propert') || lowerMessage.includes('flat') || lowerMessage.includes('house'))) {
    const cities = dbStats?.propertiesByCity?.map((c: any) => c.city + ' (' + c.count + ')').join(', ') || 'No data';
    return 'We have ' + (dbStats?.totalProperties || 0) + ' total properties. Available: ' + (dbStats?.availableProperties || 0) + '. Cities: ' + cities + '.';
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('rent') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return 'Rent ranges from Rs.' + (dbStats?.priceRange?.min || 0) + ' to Rs.' + (dbStats?.priceRange?.max || 0) + ' per month. Average: Rs.' + (dbStats?.priceRange?.avg || 0) + '.';
  }
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('request')) {
    return 'Booking Process:\n1. Login as Tenant\n2. Browse and select a property\n3. Submit booking request\n4. Owner reviews and approves/rejects\n5. You get notified of the decision';
  }
  
  if (lowerMessage.includes('role') || lowerMessage.includes('user') || lowerMessage.includes('type')) {
    return 'User Roles:\n• TENANT: Browse properties, submit booking requests\n• OWNER: List properties, manage bookings\n• ADMIN: Monitor platform, manage users';
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return 'Contact Us:\nEmail: support@houserental.com\nLocation: Chennai, India\nWe are here to help!';
  }
  
  if (lowerMessage.includes('owner') || lowerMessage.includes('list') || lowerMessage.includes('add property')) {
    return 'To list your property:\n1. Login as Owner\n2. Go to Add Property\n3. Fill details (title, rent, location, photos)\n4. Submit and manage bookings from dashboard';
  }
  
  if (lowerMessage.includes('tenant') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
    return 'To find a property:\n1. Login as Tenant\n2. Browse available properties\n3. Use filters (location, budget)\n4. Submit booking request\n5. Track status in dashboard';
  }
  
  if (lowerMessage.includes('available') || lowerMessage.includes('city') || lowerMessage.includes('location')) {
    const cities = dbStats?.propertiesByCity?.map((c: any) => c.city + ' (' + c.count + ')').join(', ') || 'No data';
    return 'Available properties by city: ' + cities + '. Total: ' + (dbStats?.totalProperties || 0) + ' properties.';
  }
  
  if (lowerMessage.includes('type') || lowerMessage.includes('apartment') || lowerMessage.includes('flat') || lowerMessage.includes('house')) {
    const types = dbStats?.propertiesByType?.map((t: any) => t.property_type + ' (' + t.count + ')').join(', ') || 'No data';
    return 'Property types available: ' + types + '.';
  }
  
  return 'I am your HouseRental assistant! I can help with:\n• Property search (try "properties in Chennai")\n• Pricing info (try "rent range")\n• Booking process\n• User roles\n\nWe have ' + (dbStats?.totalProperties || 0) + ' properties listed.';
}

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDatabaseStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};
