#!/bin/sh

# Run Prisma migrations
sleep 10
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
npm start
