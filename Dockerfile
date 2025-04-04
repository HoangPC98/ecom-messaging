FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install

# COPY --chown=node:node . .

EXPOSE 9000

CMD [ "npm", "run", "dev" ]