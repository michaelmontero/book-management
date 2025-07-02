# Library Management System

A modern library management system built with Next.js and NestJS, featuring real-time updates, pagination, and comprehensive book/author management.

## 🏗️ Project Structure

```
book-management/
├── api/          # Backend NestJS API
├── app/          # Frontend Next.js Application
└── README.md     # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- Docker
- yarn

### 1. Clone and Install

```bash
git clone https://github.com/michaelmontero/book-management.git
cd book-management
yarn install:all
```

### 2. Environment Setup

#### Frontend
Copy `app/.env.example` to `app/.env`:

#### Backend  
Copy `api/.env.example` to `api/.env`:

### 3. Start MongoDB

```bash
docker run -d \                                                                                                    ✔  22.0.0 ⬢  system ⬢  12:22:05 PM 
  --name library-mongo \                        
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=library-management \
  -v mongo_data:/data/db \
  mongo:7-jammy
```

### 4. Start Applications

From the root directory, run the following commands in separate terminal windows:
```bash
# Start backend (terminal 1)
yarn dev:api

# Start frontend (terminal 2)  
yarn dev:app
```

## 🌐 Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🛠️ Technology Stack

### Frontend
- Next.js 14 with TypeScript
- Tailwind CSS + shadcn/ui
- Real-time WebSocket updates

### Backend
- NestJS with TypeScript
- MongoDB + Mongoose
- Socket.io for real-time features

## 📚 Features

- 📱 Responsive design with mobile-first approach
- 🔍 Search and filter authors/books
- 📄 Pagination (traditional + infinite scroll)
- 📸 Author photos with fallback avatars
- 📚 ISBN validation for books
- 🔄 Real-time updates via WebSocket
- 🎨 Modern UI with Tailwind CSS

## 📄 License

MIT License
