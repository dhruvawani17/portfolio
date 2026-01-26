# 1. Build the project
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Serve the static files with Nginx
FROM nginx:alpine
# Copy the build output (dist or build folder - CHECK THIS in your local project!)
# If your project creates a 'dist' folder, keep it as is. If it creates 'build', change below to /app/build
COPY --from=builder /app/dist /usr/share/nginx/html

# 3. Configure Nginx for Cloud Run
ENV PORT 8080
# Update default nginx config to listen on port 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]