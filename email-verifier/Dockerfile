FROM node:18.17.1-bookworm-slim
WORKDIR /erxes-email-verifier

RUN chown -R node:node /erxes-email-verifier
RUN apt-get update -y \
    && apt-get install -y tzdata \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . /erxes-email-verifier
USER node
EXPOSE 4100
ENTRYPOINT ["node", "--max_old_space_size=8192", "dist"]
