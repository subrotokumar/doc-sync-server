FROM node:alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN mkdir -p /usr/src/doc-sync && chown -R node:node /usr/src/doc-sync

WORKDIR /usr/src/doc-sync

COPY package.json pnpm-lock.yaml ./

USER node

RUN pnpm install

COPY --chown=node:node . .

EXPOSE 8080

RUN pnpm tsc

CMD [ "pnpm", "start" ]