# Quick Start Guide

## Prerequisites

- **Node.js 16+**: [Download here](https://nodejs.org/)
- **PostgreSQL 12+**: [Download here](https://www.postgresql.org/download/)
- **npm or yarn**: Comes with Node.js

## Installation

### Option 1: Automatic Setup (Linux/macOS)

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

#### Step 1: Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE salon_booking;

# Exit
\q
```

#### Step 2: Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/salon_booking

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The backend will be available at `http://localhost:5000`

#### Step 3: Frontend Setup (in another terminal)

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
Soeng/
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, validation
│   │   ├── database/      # DB connection
│   │   └── index.ts       # Main app
│   └── scripts/
│       └── migrate.js     # Database setup
│
└── frontend/              # React web app
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── api/           # API client
    │   ├── i18n/          # Translations (ET/EN)
    │   └── App.tsx        # Root component
    └── index.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PATCH /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/availability?serviceId=1&staffId=1&date=2026-02-23` - Get available slots
- `PATCH /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Staff
- `GET /api/staff` - Get all staff
- `POST /api/staff` - Add staff (admin)
- `PATCH /api/staff/:id` - Update staff (admin)
- `DELETE /api/staff/:id` - Remove staff (admin)

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/salon_booking
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Features Implemented

✅ Full project structure with TypeScript
✅ Database schema with migrations
✅ Authentication (register/login with JWT)
✅ Services management
✅ Staff management
✅ Booking system with availability checking
✅ Admin role-based access control
✅ Bilingual UI (Estonian/English)
✅ Responsive design with Tailwind CSS

## Next Steps

1. Add services and staff through API or admin panel
2. Test booking flow with both guest and authenticated users
3. Implement email notifications
4. Deploy to production

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Database connection error
- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in .env
- Ensure database exists: `createdb salon_booking`

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions, refer to the main [README.md](README.md)
