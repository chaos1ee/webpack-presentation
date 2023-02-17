FROM node:16 AS build

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

FROM nginx:1.23.1

ARG BACKEND_URL

ENV ENV_BACKEND_URL=$BACKEND_URL

RUN if [ -z "$BACKEND_URL" ]; then echo "BACKEND_URL is required"; exit 1; else : ; fi

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /dist /usr/share/nginx/html