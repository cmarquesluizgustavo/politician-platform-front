# Stage 1: Install dependencies
FROM node:18 AS dependencies

# Set working directory
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the application
FROM node:18 AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Prepare the runtime environment
FROM node:18-alpine AS run

# Copy static assets and config files needed for runtime
WORKDIR /app
COPY package.json ./
COPY public ./public
COPY next.config.mjs ./next.config.mjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next

# Start the Next.js application
# CMD ["npm", "start"]
