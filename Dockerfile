FROM node

RUN mkdir -p /usr/src/doc-sync && chown -R node:node /usr/src/doc-sync

WORKDIR /usr/src/doc-sync

# Copy package json and yarn lock only to optimise the image building
COPY package.json yarn.lock ./

USER node

RUN node install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]