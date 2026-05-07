# Stage 1: Use official Node.js 20 image on lightweight Alpine Linux
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (Docker caches this layer if unchanged = faster builds)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy rest of source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# The command to run when container starts
CMD ["node", "server.js"]