FROM node:latest
ENV NODE_PORT 8080
ENV MONGO_URL 'mongodb://mongo:27017/node-express-db'

# Copy source code
COPY . /app

# Change working directory
WORKDIR /app

# Install dependencies
RUN npm install

# Expose API port to the outside
EXPOSE 8080

# Launch application
CMD ["npm","start"]