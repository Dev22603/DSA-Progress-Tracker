FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# prisma.config.mjs requires DATABASE_URL to be set just to load the config;
# generate doesn't need a reachable DB, so a placeholder is enough at build time.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE 5000

CMD ["node", "index.mjs"]
