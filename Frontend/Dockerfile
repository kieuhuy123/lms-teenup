# Frontend Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Build stage
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set build environment
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

# Build the app
RUN npm run build

# Development stage - for development with hot reload
FROM base AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Add Node.js options for development
ENV NODE_OPTIONS="--unhandled-rejections=warn"

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production stage - serve with Node.js
FROM base AS production
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]