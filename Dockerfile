# --- Stage 1: Build the React Application ---
FROM node:18-alpine as builder
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. CRITICAL: Inject the API Key before the build
# This allows Vite to see the key and "bake" it into the Javascript
ARG VITE_CEREBRAS_API_KEY
ENV VITE_CEREBRAS_API_KEY=$VITE_CEREBRAS_API_KEY

# 4. Build the static files (creates 'dist' folder)
RUN npm run build


# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# 1. Copy the build output from Stage 1
# Note: Vite defaults to 'dist'. If you changed it, update this path.
COPY --from=builder /app/dist /usr/share/nginx/html

# 2. Configure Nginx port for Cloud Run (Cloud Run expects 8080)
ENV PORT 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# 3. Start Nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]