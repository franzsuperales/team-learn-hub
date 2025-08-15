# For deployment
FROM node:18-alpine
 
# Set working directory inside the container
WORKDIR /app
 
# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm install tailwindcss postcss autoprefixer @tailwindcss/line-clamp
 
# Copy the rest of the application code
COPY . .
 
# Generate Prisma client
RUN npx prisma generate
 
RUN npm run build
 
# Expose port
EXPOSE 3000
 
# Start the Next.js app
CMD ["npm","run", "start"]