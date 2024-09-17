# Dockerfile for TypeScript Node.js app
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install Prisma Client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose the port
EXPOSE 3000

# Use the entrypoint.sh script
ENTRYPOINT ["/app/entrypoint.sh"]
