
FROM node:22-slim

WORKDIR /app/client

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--host", "0.0.0.0"]
