FROM node:18-alpine

# Set workdir
RUN rm -rf /usr/src/app/*
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app

# Copy package
COPY . .

# Clear cache and node modules
RUN rm -rf /var/www/node_modules
RUN yarn cache clean

EXPOSE 3333
EXPOSE 9229

CMD [ "sh", "-c", "yarn install --production=false --non-interactive && yarn run dev" ]