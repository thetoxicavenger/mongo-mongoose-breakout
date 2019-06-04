## Objectives
* Create a fully functional CRUD API using MongoDB and Mongoose

## Getting started
```
# prevent any permissions issues    
sudo mkdir /usr/local/Frameworks
sudo chown $(whoami):admin /usr/local/Frameworks

brew install mongodb
# to store mongo data
mkdir -p /data/db 
# start mongodb server on system startup
brew services start mongodb

npm i --save mongoose

```

## Resources
https://closebrace.com/tutorials/2017-03-02/the-dead-simple-step-by-step-guide-for-front-end-developers-to-getting-up-and-running-with-nodejs-express-and-mongodb
https://mongoosejs.com/docs/index.html
https://stackoverflow.com/questions/9269040/which-http-response-code-for-this-email-is-already-registered/32531069