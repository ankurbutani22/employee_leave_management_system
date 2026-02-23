# Employee Leave Management System - Global Deployment Guide

This project is now configured to be deployed as a **single monolith** on platforms like **Render.com**. This means the backend and both frontends run on a single URL, solving all "Failed to fetch" errors.

## Deployment Instructions (Render.com)

1.  **Create a New Web Service** on Render.
2.  **Connect your GitHub Repository**.
3.  **Root Directory**: Leave it blank (Root of the repo).
4.  **Build Command**: `npm run render-build` 
    *   (This will automatically install all dependencies and build both frontends).
5.  **Start Command**: `npm start`
    *   (This will start the Express server which serves the API and Frontends).
6.  **Environment Variables**: Add all variables from `server/.env` (MONGO_URI, JWT_SECRET, etc.).

## Access Points
Once deployed, everything will be available on your Render URL:
- **Unified Login**: `https://your-app.onrender.com/auth` (Both Admins & Employees login here).
- **Employee Portal**: `https://your-app.onrender.com/`
- **Admin Panel**: `https://your-app.onrender.com/admin`

## Why was "Failed to fetch" happening?
The error happened because Vercel only hosts the frontend. It was trying to talk to an API at `localhost:5000` or a broken backend. By using the Render approach described above, the frontend and backend are on the **same domain**, so they can communicate perfectly anywhere in the world.
