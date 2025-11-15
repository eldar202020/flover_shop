FROM node:18.18-alpine
WORKDIR /flover_shop-app
COPY package.json .
RUN npm install
COPY . .
CMD npm start