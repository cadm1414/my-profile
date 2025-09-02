# =========================
# Etapa de build
# =========================
FROM node:20-alpine AS build-stage

# Instalar dependencias del sistema necesarias para compilaciones nativas
RUN apk add --no-cache python3 make g++ libc-dev linux-headers

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (más seguro que npm ci en Alpine)
RUN npm install --silent

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# =========================
# Etapa de producción con Nginx
# =========================
FROM nginx:1.25-alpine AS production-stage

# Crear usuario nginx si no existe
RUN addgroup -g 101 -S nginx || true
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx || true

# Copiar la build de Vue al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Dar permisos correctos
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

# Instalar wget para healthcheck
RUN apk add --no-cache wget

# Exponer puerto 8080 requerido por Fly.io
EXPOSE 8080

# Healthcheck de Fly.io
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
