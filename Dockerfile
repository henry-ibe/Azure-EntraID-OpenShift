# ── Stage 1: Build ─────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ───────────────────────────────────────
FROM nginx:alpine

# OpenShift runs containers as a random non-root UID
# nginx needs write access to these dirs
RUN chmod -R 777 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /etc/nginx/conf.d

# Copy build output
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config (handles React Router + env vars)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root for OpenShift
USER 1001

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
