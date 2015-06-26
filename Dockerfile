FROM node:0.12

COPY . /app

WORKDIR /app

RUN \
  rm -rf node_modules log && \
  cd keystone && \
  npm link && \
  cd .. && \
  npm link keystone && \
  npm install --link

ENV NODE_ENV production
ENV PORT 80
ENV LOG_NAME greenlight-cms
ENV LOG_PATH log/greenlight-cms.jsonlines.log

EXPOSE 80

CMD ["npm", "start"]

