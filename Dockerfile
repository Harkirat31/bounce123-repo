# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /bounce123

# Copy the main package.json and admin/api package.json files
COPY package*.json ./
COPY apps/admin/package*.json ./apps/admin/
COPY apps/api/package*.json ./apps/api/
COPY apps/website/package*.json ./apps/website/

# Install root dependencies
RUN npm install

# Install esbuild globally
RUN npm install -g esbuild

# Install dependencies for the admin app
RUN cd apps/admin && npm install

# Install dependencies for the API app
RUN cd apps/api && npm install

#install dependencies for website
RUN cd apps/website && npm install

# Copy the rest of the application code
    COPY . .

# Build the admin and API apps
RUN cd apps/admin && npm run build && cd ../..
RUN cd apps/api && npm run build && cd ../..
RUN cd apps/website && npm run build && cd ../..

# Install PM2 globally
RUN npm install -g pm2

# Copy the PM2 configuration file
COPY pm2.config.js ./

# Expose the necessary ports
EXPOSE 3000
EXPOSE 3001
EXPOSE 4000

# Start both applications using PM2 with the config file in JSON format
CMD ["pm2-runtime", "start", "pm2.config.js"]
