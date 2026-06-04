# FROM public.ecr.aws/docker/library/node:18-slim

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # Compile TypeScript
# RUN npm run build

# EXPOSE 3018

# CMD ["node", "dist/server.js"]




FROM public.ecr.aws/docker/library/node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compile TypeScript
RUN npm run build

EXPOSE 3018

CMD ["node", "dist/server.js"]

