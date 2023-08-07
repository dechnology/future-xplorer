FROM node:lts-slim

WORKDIR /src

COPY package.json .
COPY yarn.lock .
RUN yarn install --production=false

COPY . .

RUN yarn build
RUN yarn autoclean --force

CMD [ "node", ".output/server/index.mjs" ]
