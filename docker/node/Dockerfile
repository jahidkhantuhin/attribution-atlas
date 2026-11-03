FROM node:16-alpine
WORKDIR /var/www/attribution-atlas/

COPY ./src/package.json ./
COPY ./src/package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY ./src/ ./

EXPOSE 5000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000
