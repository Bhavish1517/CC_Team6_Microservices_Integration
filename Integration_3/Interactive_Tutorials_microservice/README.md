# Interactive Tutorials Microservice

This service consists of a React frontend and Node.js backend.

## Setup Instructions

### 1. Build the Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Start the Backend
```bash
cd backend
npm install
node server.cjs
```

The service will be available at http://localhost:3007

## Notes
- The service is integrated with SSO authentication
- All API routes are protected and require authentication
- After logging in through the auth service (port 3001), you'll be redirected back to the tutorials homepage 