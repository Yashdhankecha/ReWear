# ReWear

A sustainable fashion platform that promotes clothing reuse and reduces textile waste through a modern web application.

## 🚀 Features

- **🔐 Multi-Authentication**: Email/password and Google OAuth
- **📧 Email Verification**: OTP-based email verification system
- **🔑 JWT Authentication**: Secure token-based authentication
- **🔄 Password Reset**: Secure password reset with OTP
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **🛡️ Security**: Industry-standard security practices
- **📱 Responsive**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Nodemailer** - Email sending
- **bcryptjs** - Password hashing

### Authentication
- **Google OAuth 2.0** - Social login
- **JWT Tokens** - Stateless authentication
- **OTP Verification** - Email verification
- **Password Reset** - Secure password recovery

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ReWear.git
cd ReWear
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Setup

#### Backend Environment
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mern-auth-app

# Email Configuration (for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Client URL (for OAuth redirects)
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### 5. Start the Application

#### Development Mode
```bash
# Start backend (from server directory)
cd server
npm run dev

# Start frontend (from client directory)
cd client
npm run dev
```

#### Production Mode
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

## 🚀 Usage

### Authentication Flow

1. **Sign Up**: Users can create accounts with email/password
2. **Email Verification**: OTP sent to email for verification
3. **Login**: Traditional login or Google OAuth
4. **Password Reset**: Secure password recovery via email
5. **Dashboard**: Protected user dashboard

### API Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

#### Google OAuth
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

#### Protected Routes
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

## 🔧 Development

### Project Structure
```
ReWear/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
└── docs/                  # Documentation
```

### Available Scripts

#### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Email Verification**: OTP-based verification
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Secure configuration management
- **Input Validation**: Comprehensive request validation

## 🧪 Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set up MongoDB (Atlas recommended for production)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/ReWear/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error messages

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Passport.js](http://www.passportjs.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Made with ❤️ by [Your Name]**
