# Usar Node.js 20 LTS
FROM node:20-alpine as build-stage

# Instalar herramientas de build
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar cache de npm y instalar dependencias
RUN npm cache clean --force
RUN npm ci --silent

# Verificar que las dependencias estén instaladas
RUN npm list --depth=0

# Copiar código fuente
COPY . .

# Verificar que vite esté disponible
RUN npx vite --version

# Construir la aplicación para producción
RUN npm run build

# Verificar que la carpeta dist se haya creado
RUN ls -la dist/

# Etapa de producción con Nginx
FROM nginx:1.25-alpine as production-stage

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

# Exponer puerto 8080 (requerido por Fly.io)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
