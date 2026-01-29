# DineFine - Hotel Management System

A modern MERN Stack application for managing restaurant workflows.

## Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Must be running locally or have a cloud URI)

## Quick Start from Scratch

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```
   *(This installs packages for both client and server)*

2. **Start MongoDB**
   - **Mac**: `brew services start mongodb-community` OR run `mongod` in a separate terminal.
   - **Windows**: Ensure the MongoDB Service is running.
   - **Atlas (Cloud)**: Create a cluster and paste the URI into `server/.env`.

3. **Run the Application**
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:5173`
   - Server: `http://localhost:5001`

## Features
- **Monorepo Structure**: `client` (Vite+React+Tailwind) and `server` (Express+Mongo) in one.
- **Role-Based Access**:
  - **Admin**: Revenue charts, menu management.
  - **Chef**: Kitchen Display System (KDS).
  - **Customer**: Mobile-responsive menu & order tracking.
- **Glassmorphism Design**: Premium UI using Tailwind CSS.

## Troubleshooting
- **Port 5000 in use?** The app is configured to use Port **5001** for the server to avoid macOS AirPlay conflicts.
- **MongoDB Error?** Check the console logs. You MUST have a database running.
