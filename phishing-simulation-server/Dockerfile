FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -f


COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
