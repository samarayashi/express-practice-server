FROM ubuntu:latest
USER root
RUN apt-get update
RUN apt-get -y install curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=16.13.0
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version
COPY package.json nodemon.json /home/app/
COPY server /home/app/server
COPY swagger /home/app/swagger
WORKDIR /home/app
RUN npm install && npm cache clean --force
CMD npm run start