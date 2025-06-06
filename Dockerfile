# Use a Debian-based Node.js image (more compatible for native modules)
FROM node:18-buster

# Install required build dependencies
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libpixman-1-dev \
    fontconfig \
    libjpeg-dev \
    && apt-get clean

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all the application files into the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Command to run the app when the container starts
CMD ["node", "server.js"]
