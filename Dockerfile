FROM node:22.23-alpine AS build
WORKDIR /app

ARG PUBLIC_KEY
ARG APP_NAME
ARG API_URL
ARG AUTH_URL
ARG FILE_URL
ARG RELEASE
ARG VERSION
ARG NODE_ENV=production

ENV PUBLIC_KEY=${PUBLIC_KEY} \
    APP_NAME=${APP_NAME} \
    API_URL=${API_URL} \
    AUTH_URL=${AUTH_URL} \
    FILE_URL=${FILE_URL} \
    RELEASE=${RELEASE} \
    VERSION=${VERSION} \
    NODE_ENV=${NODE_ENV}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run prebuild
RUN npm run build

FROM nginx:stable-alpine AS runtime
COPY nginx/proxy.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/browser /usr/share/nginx/html

EXPOSE 80