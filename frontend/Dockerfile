FROM node:22 AS build

ENV VITE_API_URL=http://localhost:3000
ENV VITE_API_BASE_URL=http://localhost:3000/api
ENV VITE_API_TIMEOUT=15000
ENV VITE_API_UPLOAD_URL=http://localhost:3000/uploads/v0/

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vue.js application
RUN npm run build

# Use the official Nginx image as the base image for the production stage
FROM nginx:alpine

# Copy the built Vue.js application from the build stage to the Nginx web server directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 to allow access to the application
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
