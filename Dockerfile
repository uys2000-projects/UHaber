FROM node:alpine

WORKDIR /app

COPY dist .

CMD [ "node", "main.cjs" ]
