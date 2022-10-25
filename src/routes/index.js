// Import Routes
const WelcomeRoute=require('./welcomeRoute');
const rateLimit =require('express-rate-limit');
const authRoute=require('./authentication/authRoute');
const SellerauthRoute=require('./seller/sellerRoute');
const BuyerauthRoute=require('./buyer/buyerRoute');
 const StaffauthRoute=require('./staff/staffRoute');
const AdminauthRoute=require('./admin/adminRoute');
const path = require('path');


module.exports = app => {
  const limit = rateLimit({
    windowMs:  60 * 60 * 1000, // 1 Hour 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many accounts created from this IP, please try again after an hour' // error message
  });
   

   

  //Route Middlewares
app.use(limit)// Setting limit on specific route
app.use('/',WelcomeRoute);
app.use('/api',WelcomeRoute);
app.use('/api/auth',authRoute); 
app.use('/api/seller',SellerauthRoute);
app.use('/api/buyer',BuyerauthRoute);
app.use('/api/staff',StaffauthRoute);
app.use('/api/admin',AdminauthRoute);


app.use((req,res,next) =>{
const error =new Error('Module Not found');
error.status= 404;
next(error);
});

app.use((error,req,res,next) => {
 // console.log(error)
 res.status(error.status || 500);
 return res.json({
   error:{
     message:error.message
   }
 })
});


};