
FROM node:18 AS BUILD_IMAGE
WORKDIR /app

ARG branch=local
ARG node_explorer_git="https://github.com/openmina/mina-ci-frontend"
RUN git clone ${node_explorer_git}
RUN cd mina-ci-frontend
WORKDIR /app/mina-ci-frontend
RUN git checkout ${branch}
RUN git pull

RUN npm install
RUN node_modules/.bin/ng build --configuration production
RUN npm prune --production

FROM nginx:alpine
ENV AGGREGATOR_URL=$AGGREGATOR_URL
COPY --from=BUILD_IMAGE /app/mina-ci-frontend/dist/mina-ci-frontend /usr/share/nginx/html
COPY --from=BUILD_IMAGE /app/mina-ci-frontend/nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
