FROM node:10-alpine

COPY package.json .
COPY src .

RUN npm install

CMD ["npm", "start"]

EXPOSE 8080
