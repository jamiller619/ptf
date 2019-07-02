FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /server
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD node index.js