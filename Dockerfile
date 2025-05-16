# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g vite

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# iNSTALL ADDITIONAL DEPENDENCIES
RUN npm install recharts date-fns axios 

RUN npm install mongodb

# Copy all files
COPY . .

# Expose port
EXPOSE 8080

# Start development server with host flag to make it accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]