FROM node:10-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY src src

RUN npm install

CMD ["npm", "start"]

EXPOSE 8080
