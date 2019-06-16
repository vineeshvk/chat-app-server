#Stage 1
FROM node:alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY src ./
COPY tsconfig.json ./
RUN npm run build


#Stage 2
FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --production

COPY --from=builder /usr/src/app/build ./
COPY src/schema/typeDefs.graphql ./schema/typeDefs.graphql
COPY src/config/chap-app27-firebase-adminsdk-1i7ch-48b0700d0e.json ./config/
COPY .env ./

EXPOSE 3350

CMD node index.js