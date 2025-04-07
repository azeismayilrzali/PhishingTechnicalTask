FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install -f

# Copy application source
COPY . .

RUN npm run build


# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
