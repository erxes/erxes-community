FROM node:18.17.1-bookworm-slim
WORKDIR /client-portal/
RUN chown -R node:node /client-portal
COPY --chown=node:node . /client-portal
USER node
ENTRYPOINT [ "sh", "./docker-entrypoint.sh" ]
CMD [ "yarn", "start" ]