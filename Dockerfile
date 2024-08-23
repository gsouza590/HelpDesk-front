# Estágio de build
FROM node:20 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Estágio de execução
FROM nginx:alpine
COPY --from=build /app/dist/helpdesk /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80  
CMD ["nginx", "-g", "daemon off;"]
