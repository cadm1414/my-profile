# Usar Node.js como imagen base
FROM node:18-alpine as build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:stable-alpine as production-stage

# Copiar la build de Vue al directorio de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 8080 (requerido por Fly.io)
EXPOSE 8080

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
