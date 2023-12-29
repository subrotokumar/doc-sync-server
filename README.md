# DocSync  
**Realtime Collaborative Document Editor** 

This is the backend server for Doc-sync, a real-time collaborative cross-platfrom document editor app for Android, IOS and Web.

### Overview
The doc-sync backend is built with:

![](https://skillicons.dev/icons?i=nodejs,typescript,express,mongodb,prometheus,grafana&theme=light)

- Nodejs
- TypeScript
- Express - web framework
- MongoDB - database
- Socket.IO - realtime communication
- Prometheus
- Grafana

### Key features:

- User authentication and access control
- Realtime collaborative editing using Socket.IO
- Document CRUD (create, read, update, delete) operations
- Change tracking on documents for revision history
- Document access control - private or public
- User profiles and management

### Getting Started

**Prerequisites:** 
- Node.js
- Docker


Installation
```bash
# Clone the repo
git clone https://github.com/user/doc-sync-server.git
cd doc-sync-server

# Install dependencies
npm install
# or: yarn
# or: pnpm install

# Configure your MongoDB connection string in .env

# Run the server
npm run dev

# Server runs on http://localhost:3001
```

API Documentation
API documentation can be found at API_DOCS.md

### Architecture
`src/index.ts` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose.

`routes/` - This folder contains the route definitions for our API.

`controllers/` - This folder contains the controller implementations for our API routes.

`models/` - This folder contains the MongoDB/Mongoose models for our application data.

`middlewares/` - This folder contains custom express middlewares used by the app.

`sockets/` - This folder contains the socket.io logic for realtime communication.

### Contributing
Contributions are welcome! Please check out the Contributing Guide.

### License
MIT