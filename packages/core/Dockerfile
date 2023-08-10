FROM node:18.17.0-bookworm-slim
WORKDIR /core-api

RUN apt-get update -y \
    && apt-get install -y curl tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && chown -R node:node /core-api

COPY --chown=node:node . /core-api
USER node
ENTRYPOINT ["node", "--max-http-header-size=16384", "dist/core/src"]