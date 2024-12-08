# Use the official Node.js image as the base image
FROM node:22.11-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Run the deploy script
CMD ["npm", "run", "deploy"]