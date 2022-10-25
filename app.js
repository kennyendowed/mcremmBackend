const express= require('express');
const compression = require("compression");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv=require('dotenv');
const fileUpload = require('express-fileupload');
const app=express();
 const rund=require("./src/config/inistial");

dotenv.config();

var corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
  // exposedHeaders: ['Authorization']
  };

  app.use(cors(corsOptions));
  app.use(compression({
    level:6,
    threshold:100 * 1000,
    filter: shouldCompress
  }));
  function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}

//Middlewares
app.use(express.json());
// enable files upload
app.use(fileUpload({
  createParentPath: true
}));
app.use('/assets',express.static('assets'));
app.use('/assets/uploads',express.static('assets/uploads'));
app.use('/assets/images',express.static('assets/images'));


//=== 1 - CONFIGURE ROUTES
//Configure Route
require('./src/routes/index')(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



