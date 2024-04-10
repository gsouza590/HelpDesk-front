# DockerFile Angular
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de execução
FROM nginx:alpine
COPY --from=build /app/dist/helpdesk /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
