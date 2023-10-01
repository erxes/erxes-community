FROM node:18-alpine AS base
WORKDIR /exmweb/
RUN chown -R node:node /exmweb
COPY --chown=node:node . /exmweb
USER node
RUN yarn build
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]
