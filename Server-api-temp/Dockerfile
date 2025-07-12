# Use a lightweight Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build TypeScript
RUN yarn build

# Expose port 8887
EXPOSE 8887

# Start the API server
CMD ["npm", "start"]