FROM node:18.17.0-bookworm-slim
WORKDIR /core-api

RUN apt-get update -y \
    && apt-get install -y curl tzdata \
    && apt-get autoclean  \
    && apt-get autoremove --yes \
    && rm -rf /var/lib/{apt,dpkg,cache,log}/ \
    && chown -R node:node /core-api

# && rm -rf /var/lib/apt/lists/* \

COPY --chown=node:node . /core-api
USER node
ENTRYPOINT ["node", "--max-http-header-size=16384", "dist/core/src"]