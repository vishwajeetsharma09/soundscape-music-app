#!/bin/bash
echo "🔨 Building SoundScape for production..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build the project
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build completed successfully!"