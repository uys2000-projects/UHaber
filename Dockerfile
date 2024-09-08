FROM node:slim

WORKDIR /app

COPY . .

RUN npm install

CMD [ "node", "index.js" ]

EXPOSE 3000