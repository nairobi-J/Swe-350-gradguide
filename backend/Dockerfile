# Use a lightweight Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
# This means npm install only runs if dependencies change
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend application code
COPY . .

# Expose the port your Node.js backend listens on
# Common ports are 3000, 3001, 8080. Verify what your server.js (or app.js) uses.
EXPOSE 5000

# Command to run the backend server when the container starts
# Replace 'server.js' with your actual backend's main entry file (e.g., 'index.js', 'app.js')
CMD ["node", "index.js"]