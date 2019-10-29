FROM node:12.13-alpine
LABEL maintainer="docker@ugamela.org"

RUN apk update

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

WORKDIR /srv/www/api/

COPY src/ .
COPY package.json .
COPY tsconfig.json .
COPY gulpfile.js .

RUN npm i -g npm

RUN npm install --quiet node-gyp -g

RUN npm install --global gulp-cli

RUN npm install --global pm2

RUN npm install --production

RUN npm run build

EXPOSE 3000

RUN ls -la

CMD ["pm2-runtime", "/srv/www/api/dist/index.js", "&"]
