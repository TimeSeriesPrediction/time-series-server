# Using node version 6
FROM node:6

# Create application directory and all parents
RUN mkdir -p /usr/src/time-series-server

# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/time-series-server

# Copy server content to working directory
COPY . /usr/src/app

# Install dependecies
RUN npm install

# Expose the port you want the server to run in
EXPOSE 3000

# Start the server
CMD ["npm", "start"]