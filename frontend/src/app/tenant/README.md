# Tenant Module

This module contains all tenant-related components for the House Rental Management System.

## Components

### 1. Tenant Dashboard (`tenant-dashboard`)
- **Route**: `/tenant/dashboard`
- **Features**:
  - Quick property search with filters (location, budget, amenities)
  - Statistics overview (available properties, bookings, pending requests)
  - Recently added properties showcase
  - Quick action links

### 2. Tenant Properties (`tenant-properties`)
- **Route**: `/tenant/properties`
- **Features**:
  - Advanced property search and filtering
  - Filter by location, budget range, and amenities
  - Property grid with detailed information
  - Property cards showing images, details, and amenities
  - Direct booking and view details actions

### 3. Tenant Bookings (`tenant-bookings`)
- **Route**: `/tenant/bookings`
- **Features**:
  - View all booking requests with status tracking
  - Tabbed interface for different booking statuses (All, Pending, Approved)
  - Booking statistics dashboard
  - Contact owner functionality for approved bookings
  - Cancel pending requests

## Design Features

- **Consistent Styling**: Matches the existing admin module design patterns
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Material Design**: Uses Angular Material components throughout
- **Gradient Themes**: Blue gradient theme (#00d2ff to #3a7bd5) for tenant sections
- **Animations**: Smooth fade-in animations and hover effects
- **Dark Theme**: Consistent with the overall application theme

## Navigation

The tenant module uses a sidebar navigation with:
- Dashboard
- Search Properties
- My Bookings

## Authentication

All tenant routes are protected by the `tenantGuard` which ensures only users with 'tenant' role can access these pages.

## Data Structure

The components use mock data that matches the expected API structure:
- Properties with images, amenities, location, pricing
- Booking requests with status tracking
- User authentication state management

## Future Enhancements

- Integration with backend APIs
- Real-time booking status updates
- Property favorites functionality
- Advanced search filters
- Property comparison feature