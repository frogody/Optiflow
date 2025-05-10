FROM node:20-slim

WORKDIR /app

RUN npm install -g tsx @dotenvx/dotenvx

COPY package.json package-lock.json ./
RUN npm install

COPY src ./src
COPY tsconfig.json ./
COPY .env.local ./

# Run the agent
CMD ["dotenvx", "run", "-f", ".env.local", "--", "tsx", "src/listen-and-respond.ts", "prod"] 