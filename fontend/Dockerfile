FROM node:20.0.0 as build

WORKDIR /app/font
COPY package.json .
COPY package-lock.json .
COPY .env ./

RUN npm install
COPY . .

RUN npm run build

# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage to the nginx web server directory
COPY --from=build /app/font/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]