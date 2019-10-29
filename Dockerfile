FROM node:12.13-alpine

RUN apk update

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g


WORKDIR /srv/www/api/

RUN git clone https://github.com/ugml/api.git .

RUN npm i -g npm

RUN npm install --quiet node-gyp -g

RUN npm install --global gulp-cli

RUN npm install --global pm2

RUN npm install

RUN npm run build

CMD ["pm2-runtime", "/srv/www/api/dist/index.js", "&"]
