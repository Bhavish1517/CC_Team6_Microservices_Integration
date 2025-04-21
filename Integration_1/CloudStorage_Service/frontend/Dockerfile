# Use an official Node.js runtime as a parent image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./  

# Install dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY ./ .  

# Build the React app for production
RUN npm run build

# Use nginx to serve the app
FROM nginx:alpine

# Copy the build files to nginx’s public folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]