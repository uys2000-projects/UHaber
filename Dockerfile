FROM node:slim

WORKDIR /app

COPY . .

RUN yarn

CMD [ "yarn", "start" ]
