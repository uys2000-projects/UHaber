FROM node:alpine

WORKDIR /app

COPY . .

RUN apk add git
RUN yarn

CMD [ "yarn", "start" ]
