FROM node:alpine
ADD package.json /app/
WORKDIR /app
RUN npm install -g bower
RUN npm install -g grunt
RUN npm install
ADD . /app/
RUN bower install --allow-root
EXPOSE 9000
CMD grunt serve
