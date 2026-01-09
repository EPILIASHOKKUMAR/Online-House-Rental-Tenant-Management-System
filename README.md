# 🏠 Online House Rental & Tenant Management System

A full-stack web application where property owners can list houses and tenants can search, view, and book rental properties.

![Angular](https://img.shields.io/badge/Angular-18-red)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)

## 🌐 Live Demo

- **Frontend:** https://houserental-theta.vercel.app
- **Backend API:** https://online-house-rental-tenant-management.onrender.com

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)
7. [Installation & Setup](#installation--setup)
8. [Project Structure](#project-structure)
9. [Key Integrations](#key-integrations)
10. [Deployment](#deployment)
11. [Screenshots](#screenshots)

---

## 📖 Project Overview

This project is a comprehensive house rental platform that connects property owners with potential tenants. The system provides role-based access for three types of users:

- **Owner:** Can list properties, manage listings, and handle booking requests
- **Tenant:** Can search properties, save favorites, and request bookings
- **Admin:** Can oversee all users, properties, and view analytics

The application follows modern web development practices with a clear separation between frontend and backend, RESTful API design, and real-time notifications.

---

## ✨ Features

### Authentication & Security
- ✅ User Registration with role selection (Owner/Tenant)
- ✅ Login with JWT token-based authentication
- ✅ Sign in with Google (OAuth 2.0)
- ✅ Forgot Password with Email OTP verification
- ✅ Password hashing using bcrypt
- ✅ Role-based route guards

### Property Management (Owner)
- ✅ Add new property with multiple photos
- ✅ Geolocation tagging (capture current location)
- ✅ Edit and delete properties
- ✅ View all listed properties
- ✅ Manage booking requests (Approve/Reject)

### Property Search (Tenant)
- ✅ Browse all available properties
- ✅ Filter by location, budget, and amenities
- ✅ View property details with image gallery
- ✅ Interactive map showing property location
- ✅ Save/favorite properties
- ✅ Request booking with move-in date

### Real-time Features
- ✅ Socket.io for instant notifications
- ✅ Real-time booking status updates
- ✅ AI Chatbot powered by Google Gemini

### Admin Dashboard
- ✅ View all users (Owners & Tenants)
- ✅ View all properties
- ✅ Booking statistics and analytics
- ✅ System overview dashboard

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Angular 18 | Frontend Framework |
| TypeScript | Programming Language |
| Angular Material | UI Components |
| RxJS | Reactive Programming |
| Leaflet.js | Interactive Maps |
| Socket.io Client | Real-time Communication |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| TypeScript | Programming Language |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Socket.io | WebSocket Server |
| Brevo API | Email Service |
| Google Gemini | AI Chatbot |

### Deployment
| Platform | Service |
|----------|---------|
| Vercel | Frontend Hosting |
| Render | Backend Hosting |
| Railway | MySQL Database |

---

## 🏗 Architecture

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐     SQL      ┌─────────────────┐
│                 │ ◄────────────────► │                 │ ◄──────────► │                 │
│  Angular App    │                    │  Node.js API    │              │  MySQL Database │
│  (Vercel)       │ ◄────────────────► │  (Render)       │              │  (Railway)      │
│                 │     WebSocket      │                 │              │                 │
└─────────────────┘                    └─────────────────┘              └─────────────────┘
                                              │
                                              │ HTTP
                                              ▼
                                    ┌─────────────────┐
                                    │  External APIs  │
                                    │  - Gemini AI    │
                                    │  - Brevo Email  │
                                    │  - Google OAuth │
                                    └─────────────────┘
```

---

## 🗄 Database Design

### Tables
- **users** - Stores user information (name, email, password, phone, role)
- **properties** - Stores property details (title, rent, location, amenities, photos, coordinates)
- **bookings** - Stores booking requests (property_id, tenant_id, status, move_in_date)

### Entity Relationship
- One owner can have many properties (1:N)
- One property can have many bookings (1:N)
- One tenant can have many bookings (1:N)

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/google-login` | Google OAuth login |
| POST | `/api/auth/forgot-password` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| POST | `/api/auth/reset-password` | Reset password |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/:id` | Get property by ID |
| POST | `/api/properties` | Create new property |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| GET | `/api/properties/owner/:id` | Get owner's properties |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking request |
| GET | `/api/bookings/tenant/:id` | Get tenant's bookings |
| GET | `/api/bookings/owner/:id` | Get owner's bookings |
| PUT | `/api/bookings/:id/status` | Update booking status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/stats` | Get dashboard statistics |

### Chatbot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/chat` | Send message to AI |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Angular CLI (`npm install -g @angular/cli`)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your credentials:
```env
DB_HOST=your_database_host
DB_PORT=your_port
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
BREVO_API_KEY=your_brevo_api_key
SMTP_FROM=your_email
```

4. Run development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update environment file (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

4. Run development server:
```bash
ng serve -o
```

---

## 📁 Project Structure

```
Online-House-Rental-Tenant-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # Database connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Authentication logic
│   │   │   ├── property.controller.ts # Property CRUD
│   │   │   ├── booking.controller.ts  # Booking management
│   │   │   ├── admin.controller.ts    # Admin operations
│   │   │   └── chatbot.controller.ts  # AI chatbot
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── property.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   └── admin.routes.ts
│   │   └── server.ts                 # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                 # Login, Register, Forgot Password
│   │   │   ├── home/                 # Landing page
│   │   │   ├── owner/                # Owner dashboard & components
│   │   │   ├── tenant/               # Tenant dashboard & components
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── services/             # API services
│   │   │   ├── guards/               # Route guards
│   │   │   └── pipes/                # Custom pipes
│   │   ├── environments/
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
│
└── README.md
```

---

## 🔗 Key Integrations

### 1. Geolocation Tagging
We used the Browser's Geolocation API to capture the owner's current location coordinates (latitude and longitude) when adding a property. These coordinates are stored in MySQL database. On the tenant side, we used Leaflet.js library with OpenStreetMap to display an interactive map showing the property's exact location. We also integrated Google Maps links for navigation directions.

### 2. Google Gemini AI Chatbot
We integrated Google Gemini AI (gemini-2.5-flash model) as a chatbot assistant for tenants. We created an API key from Google AI Studio and stored it in environment variables. In the backend, we created a chatbot controller that sends user messages to Gemini's REST API endpoint with a system prompt defining it as a house rental assistant. The AI response is returned to the Angular frontend and displayed in a chat interface.

### 3. Email OTP (Brevo API)
We integrated forgot password functionality using Brevo Email API. When user enters their email, the backend generates a 6-digit random OTP code and stores it in the database with a 10-minute expiry time. We then send this OTP to the user's email using Brevo's HTTP API. The user enters the received OTP on the verification page, backend validates it, and if valid, allows the user to set a new password.

### 4. Google OAuth 2.0
We integrated Google OAuth 2.0 for social login using Google Cloud Console. We created OAuth 2.0 Client ID credentials and configured it in Angular using the `@abacritt/angularx-social-login` library. When user clicks "Sign in with Google", Google's popup appears for authentication and returns user profile which we use to create or find the user in database.

### 5. Real-time Notifications (Socket.io)
We used Socket.io for real-time bidirectional communication. When a tenant creates a booking, the owner receives instant notification. When owner approves/rejects, tenant gets notified immediately without page refresh.

---

## ☁️ Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `ng build`
3. Set output directory: `dist/frontend/browser`
4. Deploy automatically on push

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy automatically on push

### Database (Railway)
1. Create new MySQL database on Railway
2. Get connection credentials (host, port, user, password)
3. Configure backend `.env` with Railway credentials

---

## 📸 Screenshots

### Home Page
- Modern landing page with gradient design
- Features section highlighting key functionalities
- Navigation to login/register

### Owner Dashboard
- Property listings with edit/delete options
- Booking requests management
- Statistics overview

### Tenant Dashboard
- Browse available properties
- Filter by location, budget, amenities
- Save favorite properties
- View booking status

### Property Details
- Image gallery with thumbnails
- Property information and amenities
- Interactive map with location
- Booking request form

### Admin Dashboard
- User management
- Property overview
- Booking statistics with charts

---

## 👨‍💻 Developer

**EPILI ASHOK KUMAR**

- GitHub: [@EPILIASHOKKUMAR](https://github.com/EPILIASHOKKUMAR)

---

## 📄 License

This project is created for educational purposes as part of academic curriculum.

---

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Google for Gemini AI API
- Brevo for email services
- OpenStreetMap & Leaflet for mapping
- Vercel, Render, Railway for free hosting

---

⭐ If you found this project helpful, please give it a star!
