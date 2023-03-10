## base image
#FROM node:18 AS BUILD_IMAGE
#
## set working directory
#WORKDIR /app
#
## install angular cli
#RUN npm install -g @angular/cli
#
## clone & install deps for repo
#ARG branch=local
#ARG node_explorer_git="https://github.com/name-placeholder/mina-frontend"
#RUN git clone ${node_explorer_git} && \
#    cd mina-frontend && \
#    git checkout ${branch} && \
#    npm install
#
## change dir to angular app
#WORKDIR /app/mina-frontend
#
## buid app
#RUN ng build --configuration production --output-path=/dist
#
## remove development dependencies
#RUN npm prune --production
#
#################
## Run in NGINX #
#################
#FROM nginx:alpine
#COPY --from=BUILD_IMAGE /app/dist/mina-frontend /usr/share/nginx/html
#
## When the container starts, replace the env.js with values from environment variables
#CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# Example of how to run
# docker run --env ENV='' -p 8080:80 mina-frontend:latest


# This is local build flow
#FROM node:18 AS BUILD_IMAGE
#FROM nginx:alpine
#RUN pwd
#RUN ls -l
#WORKDIR /etc/nginx/
#RUN pwd
#RUN ls -l
#RUN cat nginx.conf
#RUN rm nginx.conf
#COPY nginx.conf .
#RUN cat nginx.conf


FROM node:18 AS BUILD_IMAGE
WORKDIR /app
RUN npm install -g @angular/cli

ARG branch=local
ARG node_explorer_git="https://github.com/openmina/mina-ci-frontend"
RUN git clone ${node_explorer_git}
RUN cd mina-ci-frontend
RUN git checkout ${branch}
RUN npm install

WORKDIR /app/mina-ci-frontend
RUN node_modules/.bin/ng build --configuration production
RUN npm prune --production

FROM nginx:alpine
ENV AGGREGATOR_URL=$AGGREGATOR_URL
COPY --from=BUILD_IMAGE /app/mina-ci-frontend/dist/mina-ci-frontend /usr/share/nginx/html
COPY --from=BUILD_IMAGE /app/mina-ci-frontend/nginx.conf /etc/nginx/nginx.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
