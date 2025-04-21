# SSO Integration with Existing Microservices

This project demonstrates how I integrated my SSO Authentication Service with two existing microservices:
1. Certificate Service (Port 3008) - This microservice handles genereation of certificates
2. Interactive Tutorials Service (Port 3007) - This microservice provides interactive tutorials for different subjects

## Integration Overview

The original microservices were standalone applications without anyauthentication systems. I integrated my SSO Authentication Service (Port 3001) with them by making several key modifications.

### Changes Made for Integration

#### 1. Authentication Middleware Integration
- Created a shared middleware (`shared/authMiddleware.js`) that both services now use
- Replaced the original authentication logic in both services with the new shared middleware
- Added JWT token verification using a shared secret key

#### 2. CORS Configuration Updates
Original services had to be modified to:
```javascript
app.use(cors({
  origin: 'http://localhost:3001', // Added SSO service origin
  credentials: true  // Added to support cookie-based auth
}));
```

#### 3. Cookie Handling Setup
Added cookie parsing support to both services:
```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

#### 4. Frontend Modifications

Certificate Service Changes:
- Added logout button component
- Modified authentication flow to redirect to SSO login
- Updated API calls to include credentials: 'include'

Interactive Tutorials Service Changes:
- Added SSO logout integration
- Updated React components to handle SSO redirects
- Modified authentication state management

#### 5. Route Protection
- Added the shared authentication middleware to protect all routes
- Modified API endpoints to expect SSO tokens instead of original auth methods

## Running the Services

### Prerequisites
1. Node.js (version 14.x or higher)
2. npm package manager
3. Make sure ports 3001, 3007, and 3008 are available

### Step 1: Clone and Setup
```bash
# Clone the repositories (if not already done)
git clone [SSO-auth-repo-url]
git clone [certificate-service-repo-url]
git clone [interactive-tutorials-repo-url]
```

### Step 2: Start SSO Authentication Service (Port 3001)
```bash
# Navigate to SSO service directory
cd auth-service

# Install dependencies
npm install

# Start the service
node server.js

# The service will start on http://localhost:3001
```

### Step 3: Start Certificate Service (Port 3008)
```bash
# Open a new terminal
# Navigate to certificate service directory
cd certificate-service

# Install dependencies
npm install

# Start the service
node server.js

# The service will start on http://localhost:3008
```

### Step 4: Start Interactive Tutorials Service (Port 3007)
```bash
# Open a new terminal

# 1. Start the Backend
cd Interactive_Tutorials_microservice/backend
npm install
node server.cjs

# 2. Open another terminal
# Start the Frontend
cd Interactive_Tutorials_microservice/frontend
npm install
npm run dev

# The service will be available at http://localhost:3007
```

### Verifying the Setup

1. Open your browser and visit http://localhost:3001
2. You should see the SSO login page
3. After logging in, you can access:
   - Certificate Service: http://localhost:3008
   - Interactive Tutorials: http://localhost:3007
   - Both services should work without requiring additional login

### Troubleshooting

1. If any service fails to start:
   - Check if the required port is available
   - Ensure all dependencies are installed
   - Check the console for error messages

2. If authentication fails:
   - Clear your browser cookies
   - Ensure all three services are running
   - Check if CORS is properly configured in your environment

3. Common Issues:
   - Port conflicts: Make sure no other services are using ports 3001, 3007, or 3008
   - CORS errors: Check browser console for CORS-related messages
   - Cookie issues: Ensure your browser accepts cookies from localhost

### Development Mode

For development purposes, you can run the services with nodemon:
```bash
# Install nodemon globally if not installed
npm install -g nodemon

# Run services with nodemon
nodemon server.js  # For SSO and Certificate services
nodemon server.cjs # For Interactive Tutorials backend
```

## Integration Flow


1. After integration:
   - Authentication redirects to SSO service
   - Session management handled by SSO service
   - Logout synchronized across all services

## Service URLs

- SSO Authentication: http://localhost:3001
- Certificate Service: http://localhost:3008
- Interactive Tutorials: http://localhost:3007

## Key Integration Points

1. **Session Management**
   - Replaced individual session handling with centralized SSO cookies
   - Added shared token validation logic

2. **API Security**
   - Updated all API endpoints to verify SSO tokens
   - Modified request headers to include credentials

3. **User Experience**
   - Implemented seamless navigation between services
   - Added unified logout functionality
   - Maintained original service functionality while adding SSO features

- The original services required significant frontend modifications to support SSO
- All services now share the same authentication middleware
- Cookie-based token storage replaced original token storage methods
- CORS configurations were updated to allow secure cross-origin requests

