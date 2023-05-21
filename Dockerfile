FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]
