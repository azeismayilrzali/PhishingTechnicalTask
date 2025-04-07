# Phishing Dashboard

This project is a Phishing Dashboard application built with React and TypeScript. It allows users to send phishing emails and track their status in real-time.

## Features

- Send phishing emails to specified email addresses.
- Track the status of phishing attempts (sent, clicked).
- Real-time updates using WebSocket.
- User authentication and session management.

## Technologies Used

- React
- TypeScript
- Socket.IO
- CSS Modules
- Node.js (backend)
- Express (backend)
- MongoDB (database)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v6 or higher)


### Installation & Running the Application

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/phishing-dashboard.git
   ```

2. Start the backend servers (simulation server and api management) using 
   Docker Compose:

   ```bash
   docker compose up
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the `phishing-managemet-api` directory and add the following environment variables:

## API management
```dotenv
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27018
MONGODB_USER=root
MONGODB_PASSWORD=example
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRATION=1d
CORS_ORIGIN=*
```

Create a `.env` file in the `phishing-simulator-server` directory and add the following environment variables:

## Simulation Server
```dotenv
# Application
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:8080

# MongoDB
MONGODB_URI=mongodb://localhost:27018
MONGODB_DB_NAME=phishing-management
MONGODB_USER=root
MONGODB_PASS=example

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=false
SMTP_USER=smpt_user
SMTP_PASSWORD=smtp_password
EMAIL_FROM=email_from

```

## Usage
1. open "localhost:8080"
2. Log in to the application.
3. Use the form to send phishing emails by entering the recipient's email and selecting a template.
4. Track the status of sent phishing emails in the dashboard.
5. Log out when done.

