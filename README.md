# Hair Salon Booking System

A bilingual (Estonian/English) web application for managing hair salon appointments. Built with React, Node.js/Express, and PostgreSQL.

## Project Structure

```
Soeng/
├── backend/          # Node.js/Express API server
│   ├── src/
│   │   ├── index.ts           # Main Express app
│   │   ├── database/          # Database connection
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, validation, etc.
│   │   ├── models/            # Database interactions
│   │   └── types/             # TypeScript types
│   ├── scripts/               # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/         # React/Vite frontend
    ├── src/
    │   ├── main.tsx           # React entry point
    │   ├── App.tsx            # Main component
    │   ├── components/        # Reusable components
    │   ├── pages/             # Page components
    │   ├── api/               # API client
    │   ├── context/           # React context (Auth, etc.)
    │   ├── i18n/              # i18n translations
    │   └── index.css          # Global styles
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    └── .env.example
```

## Prerequisites

- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## Setup Instructions

### 1. Database Setup

```bash
# Install PostgreSQL
# Create a new database
createdb salon_booking
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install

# Start development server
npm run dev
```

App runs on `http://localhost:3000`

## API Endpoints (To be implemented)

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details
- `GET /api/bookings/availability` - Get available slots
- `PATCH /api/bookings/:id` - Update booking (admin/owner)
- `DELETE /api/bookings/:id` - Cancel booking (admin/owner)

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff member (admin)
- `PATCH /api/staff/:id` - Update staff (admin)
- `DELETE /api/staff/:id` - Remove staff (admin)

## Features (In Progress)

- ✅ Project structure initialized
- ✅ Database schema designed
- ✅ i18n setup (Estonian/English)
- ⏳ Authentication endpoints
- ⏳ Service management
- ⏳ Booking system
- ⏳ Admin dashboard
- ⏳ Staff management
- ⏳ Time slot availability
- ⏳ Email/SMS notifications

## Technology Stack

**Backend:**
- Express.js - Web framework
- TypeScript - Type safety
- PostgreSQL - Database
- JWT - Authentication
- bcryptjs - Password hashing

**Frontend:**
- React 18 - UI library
- TypeScript - Type safety
- Tailwind CSS - Styling
- Vite - Build tool
- React Router - Navigation
- i18next - Internationalization
- Axios - HTTP client

## Development

### Backend
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Compile TypeScript
npm run migrate  # Run database migrations
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## License

MIT
