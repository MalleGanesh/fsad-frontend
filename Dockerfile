# Stage 1: Build
FROM node:20 AS build
WORKDIR /app

# Copy only package.json to avoid platform-specific lockfile issues
COPY package.json ./

RUN npm install

# Copy all other source files (honoring .dockerignore)
COPY . .

# Accept build-time environment variables
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
