# School Management System

A comprehensive full-stack School Management System built with a consolidated Next.js frontend and a dedicated Express.js backend. This system provides a unified portal for Students, Teachers, and Administrators with role-based access control.

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Redux Toolkit**
- **shadcn/ui** components
- **Framer Motion** (animations)
- **Recharts** (charts)
- **React Hook Form** + **Zod** (forms)
- **next-themes** (dark/light mode)
- **Lucide React** (icons)
- **react-hot-toast** (notifications)

### Backend
- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (access + refresh tokens)
- **bcryptjs** (hashing)
- **Zod** (validation)
- **Socket.io** (real-time features)

## Project Structure

```
school-management/
├── src/                  # Next.js Frontend (Consolidated)
│   ├── app/              # Application Routes (Dashboard, Student, Teacher)
│   ├── components/       # Shared UI Components
│   ├── lib/              # Utils, Configs, and Store
│   └── ...
├── backend/              # Express API
│   ├── src/              # Backend Source Code
│   │   ├── models/       # Mongoose Models
│   │   ├── routes/       # API Routes
│   │   ├── middleware/   # Auth and Validation Middleware
│   │   └── index.ts      # Server Entry Point
│   └── ...
├── package.json          # Root Scripts and Shared Dependencies
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- pnpm 8+ (recommended) or npm

### Installation

```bash
# Install root and backend dependencies
pnpm install
cd backend && pnpm install
cd ..

# Start development (both frontend and backend)
pnpm run dev
# or
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Individual Development

```bash
# Start frontend only
pnpm run dev:frontend

# Start backend only
pnpm run dev:backend
```

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/schooldb
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School Management
```

## Default Login Credentials

| Portal  | Email | Password | Role   |
|--------|-------|----------|--------|
| Student | student@school.com | student123 | student |
| Teacher | teacher@school.com | teacher123 | teacher |
| Admin   | admin@school.com | admin123 | admin   |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Current user

### Dashboard Stats
- `GET /api/dashboard/admin` - Admin stats
- `GET /api/dashboard/teacher` - Teacher stats
- `GET /api/dashboard/student` - Student stats

## Build for Production

```bash
# Build frontend
pnpm run build

# Start production
pnpm run start
```

## Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- MongoDB database (MongoDB Atlas recommended)
- Git repository

### Step 1: Prepare Your Code

1. **Ensure your code is in a Git repository** (GitHub, GitLab, or Bitbucket)
2. **Update environment variables for production**

Create a `.env.local` file with production values:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api
NEXT_PUBLIC_APP_NAME=School Management
```

### Step 2: Deploy Backend to Vercel

Since Next.js frontend and Express backend are separate, you'll need to deploy them together or use a separate hosting for the backend.

#### Option A: Deploy Backend to Render/Railway (Recommended)

1. **Push your code to GitHub**
2. **Create account on Render** (https://render.com) or **Railway** (https://railway.app)
3. **Connect your GitHub repository**
4. **Set environment variables**:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_REFRESH_SECRET=your_secure_refresh_secret
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   NODE_ENV=production
   ```
5. **Deploy** and get your backend URL (e.g., `https://your-backend.onrender.com`)

#### Option B: Deploy Backend on Vercel as Serverless Functions

1. Create a `api` folder in your Next.js project
2. Move backend routes to `src/app/api/`
3. Update all API calls to use relative paths

### Step 3: Deploy Frontend to Vercel

1. **Go to Vercel Dashboard** (https://vercel.com/dashboard)
2. **Click "Add New Project"**
3. **Import your GitHub repository**
4. **Configure Project**:
   - Framework Preset: `Next.js`
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)
5. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com/api
   NEXT_PUBLIC_APP_NAME=School Management
   ```
6. **Click Deploy**

### Step 4: Verify Deployment

1. **Check frontend**: Visit your Vercel URL
2. **Test login**: Use default credentials
3. **Check API**: Ensure backend is responding

### Important Notes

- **CORS**: If deploying backend separately, update CORS settings to allow your Vercel domain
- **MongoDB Atlas**: Use MongoDB Atlas for production database (free tier available)
- **Environment Variables**: All sensitive values should be set in Vercel dashboard, not in code
- **Custom Domain**: You can add a custom domain in Vercel project settings

### Troubleshooting Deployment

#### Build Errors
- Ensure all dependencies are in `package.json`
- Check TypeScript compilation: `npx tsc --noEmit`

#### API Not Working
- Verify backend is running and accessible
- Check environment variables are set correctly
- Ensure CORS allows your frontend domain

#### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes Vercel servers (0.0.0.0/0)
- Check connection string is correct
- Ensure database user has proper permissions

## Troubleshooting

### MongoDB Connection Timeout
If you see an error like `Operation users.findOne() buffering timed out`, it means the backend cannot connect to your MongoDB database.

1. **IP Whitelist**: If using MongoDB Atlas, ensure your current IP address is whitelisted in the Atlas Dashboard under **Security > Network Access**.
2. **Local MongoDB**: If you don't want to use Atlas, install MongoDB locally and change the `MONGODB_URI` in `backend/.env` to `mongodb://localhost:27017/schooldb`.
3. **Check Logs**: The backend console will explicitly log if the connection fails and provide a tip.

## License

MIT