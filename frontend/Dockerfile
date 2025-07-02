# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install frontend dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the frontend application code
COPY . .

# Build the Next.js application for production
# This creates the optimized .next folder, including the standalone output
RUN npm run build

# Stage 2: Run the Next.js application in a smaller production-ready image
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV production

# Copy the build output from the builder stage
# The 'standalone' output copies all necessary files, including a minimal server.js
# and the node_modules needed for production.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
# You generally don't need to copy node_modules explicitly if standalone is used,
# as it includes what's necessary.
# If you have static assets that aren't in `public` or are generated outside,
# you might need `COPY --from=builder /app/.next/static ./.next/static`

# Expose the port Next.js listens on (default is 3000)
EXPOSE 3000

# Command to start the Next.js production server
# This leverages the 'start' script defined in package.json, which Next.js sets up
# to run its production server (which internally might use the generated server.js).
CMD ["npm", "start"]