FROM node:18-slim

# install dependencies sistem
RUN apt-get update && \
    apt-get install -y python3 ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# set direktori kerja
WORKDIR /usr/src/app

# copy package files
COPY package*.json ./

# install dependencies nodejs
RUN npm install

# copy semua source code
COPY . .

# register commands
RUN node deploy-commands.js

# expose port
EXPOSE 3000

# run bot
CMD ["npm", "start"]
