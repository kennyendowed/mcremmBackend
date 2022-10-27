const db = require("../models");
var customId = require("custom-id");
const nodemailer = require("nodemailer");
const utils = require("./helpers/utils");
const sendMail = require("./helpers/mailSend");
const User_Login = db.User_Login;
const User = db.user;
const Role = db.role;
const notifications= db.notifications;
const audit_logs = db.audit_logs;
const Op = db.Sequelize.Op;

var currentDate = new Date();
var datedata = currentDate.toLocaleString("en-US", {
  timeZone: "Africa/Lagos",
});

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { request } = require("express");

async function verify(req, res) {
  const verifyCode= await User.findOne({ where: {  [Op.or]: [{ email_code: req.body.code  }, { phone_code: req.body.code  }]  }});
  try {
        if (verifyCode.email_code ==req.body.code) {
        User.update({
          email_verify: "1",
          email_code: utils.randomPin(4),
          email_time: utils.addMinutes(10)
        }, { where: {  email_code: req.body.code  } }).then((data) =>{
          return  res.status(200).send({
            status:"TRUE",
           data: [
             {
               code: 200,
               data: data,
               message:"verification successfully "
             },
           ],
         });
        }).catch((error) => {
          
          console.log(error)
        });
    
      }    
      else{
        User.update({
          phone_verify: "1",
          phone_code:  utils.randomChar(2, "alpha") +  + utils.randomChar(2, "nozero"),
          phone_time: utils.addMinutes(20)
        }, { where: {  phone_code: req.body.code  } });
      return  res.status(200).send({
           status:"TRUE",
          data: [
            {
              code: 200,
              data: data,
              message:"verification successfully "
            },
          ],
        });
      }

  } catch (err) {
    res.status(400).send({
      status:"FALSE",
      data: [
        {
          code: 400,
          message: err.message,
        },
      ],
    });
  }
}

async function signup(req, res) {
  let gen = req.body.gender ? "male" : "female"; //req.body.gender.toLowerCase()
  var geb = (gen )? "assets/defaultmale.png" : "assets/defaultfemale.jpg";
  var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  const userID = utils.randomPin(8);
  const token = utils.randomPin(5); 
 const Ptoken=utils.randomChar(3, "alpha").toUpperCase() + + utils.randomChar(2, "nozero");
  // Save User to Database
  User.create({
    user_id: userID,
    phone: req.body.phone,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    avater: process.env.APP_ASSETS_URL + geb,
    email: req.body.email,
    email_time: utils.addMinutes(10),
    email_code: token,
    phone_time: utils.addMinutes(20),
    phone_code: Ptoken,
    phone_verify:"1",
    is_permission: "2",
    password: bcrypt.hashSync(req.body.password, 8),
    ip_address: ip,
  }).then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles);
        });
      } else {
        // user role = 4
        user.setRoles([2]);
      }
      values = {
        email: req.body.email,
      };
      let title = "Mcremm";
      let Emessage =
        "\n\n Hello " +
        req.body.email.split("@")[0] +
        ",\n\n Kindly use the  Mcremm . \n\n OTP : " +
        token +
        "  \n\n to complete your activity. \n\n";
        let Pmessage =
        "\n\n Hello " +
        req.body.email.split("@")[0] +
        ",\n\n Kindly use the  Mcremm . \n\n OTP : " +
        token +
        "  \n\n to complete your activity. \n\n";
      sendVerificationEmail(token, values, res, title, Emessage);
    //  utils.sendsSMS(req.body.phone,Pmessage,title);
      return res.status(200).send({
         status:"TRUE",
        data: [
          {
            code: 200,
            message:
              "A verification code has been sent and It will be expire after one day. \n\n  If you didn`t get verification OTP ? click on resend OTP",
          },
        ],
      });

    }).catch((err) => {
      return res.status(400).send({
        status:"FALSE",
        data: [
          {
            code: 400,
            message: err.message,
          },
        ],
      });
    });
}

async function resetPassword(req, res) {
  User.findOne({
    where: {
      resetPasswordToken: req.body.token,
    },
  }).then((user) => {
    let setTime = utils.addMinutes();
    var token = utils.randomPin(4);
    user.update({
      resetPasswordExpires: setTime,
      resetPasswordToken: token,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    values = {
      email: user.email,
      name: user.name,
    };
    let title = "Reset Password Notification";
    let message =
      "\n\n Hello " +
      user.email.split("@")[0] +
      ", \n\n You are receiving this email because you just changed your account  password .  \n\n If you did not request a password reset, \n\n  please try to reset your password again  and also change the password to your personal email.  ";
    sendVerificationEmail(token, values, values, title, message);
   return  res.status(200).send({
       status:"TRUE",
      data: [
        {
          code: 200,
          data: "Password has been changed ",
        },
      ],
    });
  });
}

async function signin(req, res) {
  const currentDates = new Date();
  var datetimedata =  currentDates.setTime( currentDates.getTime() - new Date().getTimezoneOffset()*60*1000 );
  var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  User.findOne({
    where: {
      [Op.or]: [{ phone: req.body.email }, { email: req.body.email }],
    },
    include:[
      {
        model: Role,
       through: "user_roles",
      },
    ]
  }).then((user) => {
    console.log(user)
      if (!user) {
        return res.status(404).send({
          status:"FALSE",
          data: [
            {
              code: 404,
              message: "User Account Not found.",
            },
          ],
        });
      }
      if (user.ip_address !== ip) {
        user.update({
          ip_address: ip,
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          status:"FALSE",
          data: [
            {
              code: 401,
              message: "Invalid Password!",
            },
          ],
        });
      }
      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
      var mail_val = {
        id: user.id,
        userId: user.user_id,
        fullname: user.first_name + " " + user.last_name,
        email: user.email,
        phone: user.phone,
        avater: user.avater,
        rolesss:authorities,
        profileType: user.profileType,
        email_verify: user.email_verify,
      };

      var token = jwt.sign(mail_val, process.env.SECRET, {
        expiresIn: 86400, // 24 hours
      });
      // var currentDates = new Date();
       var currentDateTime = utils.getcurrentDate();

      // First try to find the record
      User_Login.findOne({
        where: {
          user_id: user.id,
          currentDate: currentDateTime,
        },
      }).then((response) => {
        // console.log(response)
        if (!response) {
          // Item not found, create a new one
          const item = User_Login.create({
            user_id: user.id,
            userID:user.user_id,
            ip_address: ip,
            is_permission: user.is_permission,
            currentDate: currentDateTime,
            device: req.headers["user-agent"],
          });
        } else {
          // Found an item, update it
          const item = User_Login.update(
            {
              logged_out: false,
              token_deleted: false,
              logged_in_at: datetimedata,
              currentDate: currentDateTime,
              ip_address: ip,
              device: req.headers["user-agent"],
            },
            { where: { user_id: user.id, currentDate: currentDateTime } }
          ).then(function (user) {
              // you can now access the newly created user
              console.log("success", user);
            }).catch(function (err) {
              // print the error details
              console.log(err);
            });
        }
      });

      var arrayDataLog = [
        {
          type: "Post",
          title: "Login to account",
          status: "Successful",
          message:
            user.email.split("@")[0] +
            " Successful login @" +
            datedata,
        },
      ];
      LogActivity("TRUE", 200, arrayDataLog, user.id, datedata);
   
      return  res.status(200).send({
          status:"TRUE",
          data: [
            {
              id: user.id,
              email: user.email,
              fullname: user.first_name + " " + user.last_name,
              phone:user.phone,
              accessToken: token,
              roles: authorities,
              profileType: user.profileType,
              email_verify:   (user.email_verify == 0) ? "unverify" : "verify"
              // data:user
            },
          ],
        });
      });
    })
    .catch((err) => {
      console.log(err)
      var arrayDataLog = [
        {
          type: "Post",
          title: "Failed! Login to account",
          status: "Unsuccessful",
          ErrorMessage: err.message,
          message:
          req.body.email.split("@")[0] +
            " Unsuccessful login @" +
            datedata,
        },
      ];
      LogActivity("FALSE", 400, arrayDataLog, req.body.email, datedata);
    
    return  res.status(400).send({
        status:"FALSE",
        data: [
          {
            code: 400,
            message: err.message,
          },
        ],
      });
    });
}

async function socialSignin(req, res) {
  const token = utils.randomPin(5); 
  const Ptoken=utils.randomChar(3, "alpha").toUpperCase() + + utils.randomChar(2, "nozero");
  var authorities = [];
  var currentDates = new Date();
  var datetimedata =  currentDates.setTime( currentDates.getTime() - new Date().getTimezoneOffset()*60*1000 );
  var currentDateTime = utils.getcurrentDate();
  let gen = req.body.gender ? "male" : "female"; //req.body.gender.toLowerCase()
  var geb = (gen )? "assets/defaultmale.png" : "assets/defaultfemale.jpg";
  var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  var userID = utils.randomPin(8);
  try {
    User.findOne({
      where: { email: req.body.email 
      },
    }).then(async (user) => {
      if (!user) {
        // Save User to Database
        User.create({
          user_id: userID,
          phone: req.body.phone,
          avater: process.env.APP_ASSETS_URL + geb,
          email_verify: true,
          phone_verify:true,
          email_time: utils.addMinutes(10),
          email_code: token,
          phone_time: utils.addMinutes(20),
          phone_code: Ptoken,
          is_provider: true,
          provider: req.body.provider,
          password: bcrypt.hashSync("Mcremm"+req.body.email.split("@")[0]+"req.body.provider_id", 8),
          provider_id: req.body.provider_id,
          email: req.body.email,
          is_permission: "3",
          ip_address: ip,
        }).then(async (nuser)  => {
         await nuser.setRoles([3]);
         var nauthorities = [];
          nuser.getRoles().then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              nauthorities.push(roles[i].name.toUpperCase());
            }
          var mail_val = {
            is_provider: nuser.is_provider,
            provider: nuser.provider,
            provider_id: nuser.provider_id,
            id: nuser.id,
            userId: nuser.user_id,
            profileType: nuser.profileType,
            email: nuser.email,
            phone:nuser.phone,
            avater: nuser.avater,
            rolesss:nauthorities,
            email_verify: nuser.email_verify,
          };
        
          var token = jwt.sign(mail_val, process.env.SECRET, {
            expiresIn: 86400, // 24 hours
          });
          // First try to find the record
      User_Login.findOne({
        where: {
          user_id: nuser.id,
          currentDate: currentDateTime,
        },
      }).then((response) => {
        // console.log(response)
        if (!response) {
          // Item not found, create a new one
          const item = User_Login.create({
            user_id: nuser.id,
            userID:nuser.user_id,
            ip_address: ip,
            logged_in_at: datetimedata,
            is_permission: nuser.is_permission,
            currentDate: currentDateTime,
            device: req.headers["user-agent"],
          });
        } else {
          // Found an item, update it
          const item = User_Login.update(
            {
              logged_out: false,
              token_deleted: false,
              logged_in_at: datetimedata,
              currentDate: currentDateTime,
              ip_address: ip,
              device: req.headers["user-agent"],
            },
            { where: { user_id: nuser.id, currentDate: currentDateTime } }
          ).then(function (user) {
              // you can now access the newly created user
              console.log("success", user);
            }).catch(function (err) {
              // print the error details
              console.log(err);
            });
        }
      });
    
       

          return res.status(200).send({
            id: nuser.id,
            email: nuser.email,
            accessToken: token,
            roles: nauthorities,
            profileType: nuser.profileType,
            email_verify:   (nuser.email_verify == 0) ? "unverify" : "verify"
          });
        });
        });
      } else {
        var authorities = [];
        user.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].name.toUpperCase());
          }
        if (
          user.provider == req.body.provider &&
          user.provider_id == req.body.provider_id
        ) {
       
          var mail_val = {
            is_provider: user.is_provider,
            provider: user.provider,
            provider_id: user.provider_id,
            id: user.id,
            userId: user.user_id,
            profileType: user.profileType,
            email: user.email,
            phone:user.phone,
            avater: user.avater,
            rolesss:authorities,
            email_verify: user.email_verify,
          };

          var token = jwt.sign(mail_val, process.env.SECRET, {
            expiresIn: 86400, // 24 hours
          });
                  // First try to find the record
      User_Login.findOne({
        where: {
          user_id: user.id,
          currentDate: currentDateTime,
        },
      }).then((response) => {
        // console.log(response)
        if (!response) {
          // Item not found, create a new one
          const item = User_Login.create({
            user_id: user.id,
            userID:user.user_id,
            ip_address: ip,
            is_permission: user.is_permission,
            currentDate: currentDateTime,
            device: req.headers["user-agent"],
          });
        } else {
          // Found an item, update it
          const item = User_Login.update(
            {
              logged_out: false,
              token_deleted: false,
              logged_in_at: datetimedata,
              currentDate: currentDateTime,
              ip_address: ip,
              device: req.headers["user-agent"],
            },
            { where: { user_id: user.id, currentDate: currentDateTime } }
          ).then(function (user) {
              // you can now access the newly created user
              console.log("success", user);
            }).catch(function (err) {
              // print the error details
              console.log(err);
            });
        }
      });

          return res.status(200).send({
            id: user.id,
            email: user.email,
            accessToken: token,
            roles: authorities,
            profileType: user.profileType,
            email_verify:   (user.email_verify == 0) ? "unverify" : "verify"
          });
        } else if (
          user.provider != req.body.provider ||
          user.provider_id != req.body.provider_id
        ) {
          user.update({
            provider: req.body.provider,
            provider_id: req.body.provider_id,
          });
        
          var mail_val = {
            is_provider: user.is_provider,
            provider: user.provider,
            provider_id: user.provider_id,
            id: user.id,
            userId: user.user_id,
            email: user.email,
            phone:user.phone,
            avater: user.avater,
            profileType: user.profileType,
            rolesss:authorities,
            email_verify: user.email_verify,
          };

          var token = jwt.sign(mail_val, process.env.SECRET, {
            expiresIn: 86400, // 24 hours
          });
          // First try to find the record
      User_Login.findOne({
        where: {
          user_id: user.id,
          currentDate: currentDateTime,
        },
      }).then((response) => {
        // console.log(response)
        if (!response) {
          // Item not found, create a new one
          const item = User_Login.create({
            user_id: user.id,
            userID:user.user_id,
            ip_address: ip,
            is_permission: user.is_permission,
            currentDate: currentDateTime,
            device: req.headers["user-agent"],
          });
        } else {
          // Found an item, update it
          const item = User_Login.update(
            {
              logged_out: false,
              token_deleted: false,
              logged_in_at:datetimedata,
              currentDate: currentDateTime,
              ip_address: ip,
              device: req.headers["user-agent"],
            },
            { where: { user_id: user.id, currentDate: currentDateTime } }
          ).then(function (user) {
              // you can now access the newly created user
              console.log("success", user);
            }).catch(function (err) {
              // print the error details
              console.log(err);
            });
        }
      });
          return res.status(200).send({
            id: user.id,
            email: user.email,
            phone:user.phone,
            accessToken: token,
            roles: authorities,
            profileType: user.profileType,
            email_verify:   (user.email_verify == 0) ? "unverify" : "verify"
          });

          // return  res.status(200).send({
          //   id: user.id,
          //   username: user.username,
          //   email: user.email,
          //   accessToken: token,
          // });
        }
      });
      }
    });
  } catch (error) {
    return res.status(500).send({
      status:"FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function saveToken(req, res) {
  const {userId ,fullname,id,email,rolesss}=await req.currentUser;

  try {
    User.findOne({
      where: {
        user_id: userId,
      },
    }).then((user) => {
      user.update({
        device_token: req.body.DeviceToken,
      });
      return res.status(200).send({
         status:"TRUE",
        data: [
          {
            code: 200,
            data: "Device Token saved successfully ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status:"FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function tokenDetails(req, res) {
  // exports.tokenDetails = (req, res) => {
  let token = req.headers["x-authorization"] || req.headers["authorization"];
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        status:"FALSE",
        data: [
          {
            code: 401,
            message: "Unauthorized Access - Invalid Token Provided!",
          },
        ],
      });
    }
  
   var currentDateTime = new Date(decoded.exp * 1000);
    var datetimedata = currentDateTime.toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

 return   res.status(200).send({
       status:"TRUE",
      data: {
        code: 200,
        data: {
          // User_id: parseInt(decoded.userId),
          userId: decoded.id,
          email: decoded.email,
          phone: decoded.phone,
          profileType: decoded.profileType,
          rolesss:decoded.rolesss,
          email_verification:
          (decoded.email_verify == 0) ? "unverify" : "verify",
        //  iat: new Date(decoded.iat * 1000),
          token_exp: datetimedata,
        },
      },
    });
    // req.userId = decoded.id;
    // next();
  });
}
async function resendEmail(req, res) {
  let values = {};
  var Etoken = utils.randomPin(5);
  var Ptoken = utils.randomChar(3, "alpha").toUpperCase() +  + utils.randomChar(2, "nozero");
  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.emailOrPhone },{ phone: req.body.emailOrPhone }]
    },
  }).then(async (user) => {
    if (!user) {
      return res.status(404).send({
        status:"FALSE",
        data: [
          {
            code: 404,
            message: "User Not found.",
          },
        ],
      });
    } else {
      values = {
        email: req.body.emailOrPhone,
        name: user.name,
      };
    
     
      if (user.email ==req.body.emailOrPhone) {
        let title = "Account Verification Token";
        let message =
          "\n\n Hello " +
          user.email.split("@")[0] +  
          ",\n\n Kindly use the  Mcremm . \n\n OTP : " +
          Etoken +
          "  \n\n to complete your activity. \n\n";
   
    const mail = await  sendVerificationEmail(Etoken, values, res, title, message);
    if(mail){
      user.update({
        email_code: Etoken,
        email_time: utils.addMinutes(10)
      });
    }
    }
    else{
      let title = "Mcremm";
      let message =
        "\n\n Hello " +
        user.email.split("@")[0] +  
        ",\n\n Kindly use the  Mcremm . \n\n OTP : " +
        Ptoken +
        "  \n\n to complete your activity. \n\n";
        user.update({
        phone_code: Ptoken,
        phone_time: utils.addMinutes(20)
      });
    //  utils.sendsSMS(req.body.emailOrPhone,message,title);
    }
    }
   
 

    return res.status(200).send({
       status:"TRUE",
      data: [
        {
          code: 200,
          message:
            "Otp  has been sent to " +
            req.body.emailOrPhone +
            ".If you didn`t get verification OTP ?  click on resend OTP",
        },
      ],
    });
  });
}

async function resetPassowrdLink(req, res) {
  let values = {};
  var Etoken = utils.randomPin(5);
  var Ptoken = utils.randomChar(3, "alpha").toUpperCase() +  + utils.randomChar(2, "nozero");
  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.emailOrPhone },{ phone: req.body.emailOrPhone }]
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        status:"FALSE",
        data: [
          {
            code: 404,
            message:
              req.body.email +
              " account is not register with us please check email again or create a new account",
          },
        ],
      });
    } else {
      if (user.email ==req.body.emailOrPhone) {
        values = {
          email: req.body.emailOrPhone,
          name:  req.body.emailOrPhone.split("@")[0] 
        };
        let title = "Reset Password Link";
        let message =
          "\n\n Hello " +
          values.name +
          ", \n\n You are receiving this email because we received a password reset request for your account.  \n\nEmail :  " +
          req.body.emailOrPhone +
          ",\n\nReset Password code " +
          Etoken +
          "\n\n If you did not request a password reset, no further action is required. ";
       sendVerificationEmail(Etoken, values, res, title, message);
      let setTime = utils.addMinutes(10);
      user.update({
        email_time: setTime,
        resetPasswordExpires: setTime,
        resetPasswordToken: Etoken,
      });
    }
    else{
      let title = "Mcremm";
      let message =
        "\n\n Hello " +
        req.body.emailOrPhone.split("@")[0]+  
        ",\n\n Kindly use the  Mcremm . \n\n OTP : " +
        Ptoken +
        "  \n\n to complete your activity. \n\n";
        user.update({
        resetPasswordToken: Ptoken,
        resetPasswordExpires: utils.addMinutes(20),
        phone_time: utils.addMinutes(20)
      });
    //  utils.sendsSMS(req.body.emailOrPhone,message,title);
    }
    return res.status(200).send({
       status:"TRUE",
      data: [
        {
          code: 200,
          data:
            "Otp  has been sent to " +
            req.body.emailOrPhone +
            ". \n\n If you didn`t get verification OTP ? click on resend OTP",
        },
      ],
    });
    }       

  });
}

async function sendVerificationEmail(token, req, res, title, message) {

  let  RefferuserID =  await  User.findOne({ where: {email:req.email}});
  try {
    let template = "index";
    let subject = title;
    let url = req.headers ? req.headers.host : process.env.APP_URL;
    let name = req.body ? req.body.name : req.name;
    let to = req.body ? req.body.email : req.email;
    let from = process.env.MAIL_FROM_ADDRESS;
    let link =
      "<a href='http://" + url + "/api/auth/verify/" + token + "'>link</a> ";
    let code = token;

    //    `\n\nHi ${req.body.name }\n\n<br>\n\nPlease click on the following <a href="${link}">link</a> to verify your account.</p>
    //  <br>\n\nIf you did not request this, please ignore this email.</p>`;
    //'Hello '+ req.body.name +',\n\n' + 'Please verify your account by clicking the link: \n' + link + '\n\nThank You!\n' ;

    await sendMail(template, name, to, from, subject, message);
   return true
  } catch (err) {
    var arrayDataLog = [
      {
        type: "Post",
        title: "Failed! Login to account",
        status: "Unsuccessful",
        ErrorMessage: err.message,
        message:
          "Technical Issue!, Please click on resend for verify your Email." +
          datedata,
      },
    ];
    LogActivity("FALSE", 400, arrayDataLog, RefferuserID.id, datedata);

    return res.status(500).send({
      status:"FALSE",
      data: [
        {
          code: 500,
          message:
            err.message ||
            "Technical Issue!, Please click on resend for verify your Email.",
        },
      ],
    });
  }
}

async function comleteProfileDetails(req, res) {
  var {userId ,id,email,rolesss,is_seller,profileType}=await req.currentUser;
  const {organisation,individual} =req.body;
try {

  if(individual && individual.length > 0) {

    individualDetails.findOne({
      where: {user_id: userId },
    }).then((trans) => {
      if (!trans) {
        individualDetails.create({
          profileType: individual[0].profileType.type,
          user_id: userId,
          serviceCategory: individual[0].ServiceRendering.serviceCategory,
          subServiceCategory: individual[0].ServiceRendering.subServiceCategory,
          ServiceSkills: individual[0].ServiceRendering.ServiceSkills,
          experinceLevel: individual[0].ExperinceLevel,
          education: individual[0].Education,
          WorkHistory: individual[0].WorkHistory,
          achievement: individual[0].achievement,
          profileOverview: individual[0].profileOverview,
          location: individual[0].location
        }).then(function(response) {
         if(response){
          User.update(
            {
              profileType: individual[0].profileType.type,
              first_name: individual[0].profileDetails.firstName,
              last_name: individual[0].profileDetails.lastName,
              dob: individual[0].profileDetails.dob,
              phone: individual[0].profileDetails.phoneNumber,
              alternativeNumber: individual[0].profileDetails.alternativeNumber,
              avater: individual[0].profileType.profileImage,
              profileDocumentFront: individual[0].profileType.profileDocumentFrontImage,
              profileDocumentBack: individual[0].profileType.profileDocumentBackImage,
              profileDocumentName: individual[0].profileType.profileDocumentName,
            },
            { where: { user_id: userId } }
          );
         }
        });
      }
    return res.status(200).send({
      status:"TRUE",
      code: 200,
      data: "Account updated successfully ",
    });
  });
  }
  if(organisation && organisation.length > 0) {
    // console.log(organisation)
    organisationDetails.findOne({
      where: {user_id: userId },
    }).then((trans) => {
      if (!trans) {
        organisationDetails.create({
          profileType: organisation[0].profileType.type,
          user_id: userId,
          serviceCategory: organisation[0].ServiceRendering.serviceCategory,
          subServiceCategory: organisation[0].ServiceRendering.subServiceCategory,
          experinceLevel: organisation[0].ExperinceLevel,         
          achievement: organisation[0].achievement,
          location: organisation[0].location
        }).then(function(response) {
         if(response){
          User.update(
            {
              companyprofileImage: organisation[0].organisationDetails.profileImage,
              companycacDocumentImage :organisation[0].organisationDetails.cacDocumentImage,
              profileType: organisation[0].profileType.type,
              companyName: organisation[0].organisationDetails.companyName,
              companydescription: organisation[0].organisationDetails.description,
              companydateFounded: organisation[0].organisationDetails.dateFounded,
              companyphoneNumber: organisation[0].organisationDetails.phoneNumber,
              companycontactPersonFirstName: organisation[0].organisationDetails.contactPersonFirstName,
              companycontactPersonLastName: organisation[0].organisationDetails.contactPersonLastName,
            },
            { where: { user_id: userId } }
          );
         }
        });
      }
    return res.status(200).send({
      status:"TRUE",
      code: 200,
      data: "Account updated successfully ",
    });
  });
  }



} catch (error) {
  return res.status(500).send({
    status:"FALSE",
    data: [
      {
        code: 500,
        message: "Whoops, looks like something went wrong",
        developerMessage: error.message,
      },
    ],
  });
}

}

async function getProfileDetails(req, res) {
  var {userId ,id,email,rolesss,is_seller,profileType}=await req.currentUser;
  try {
    User.findOne({
      where: {
        user_id: userId,
      },
      attributes: [
      "user_id","last_name","id", "dob", "phone", "alternativeNumber","first_name", "profileType", "companydescription", "companydateFounded",
        "companyphoneNumber", "companycontactPersonFirstName","companycontactPersonLastName","companyName"
      ],
      //  {    
      //   exclude: ["createdAt", "updatedAt", "is_deleted"],
      // },
      include: [
        {
          model: individualDetails,       
          as: "individualdetails",
        },
        {
          model: organisationDetails,       
          as: "organisation_details",
        }
      ],
    }).then((data) => {
        return res.status(200).send({
        status:"TRUE",
        code: 200,
        data: data
      });
    });
  } catch (error) {
    return res.status(500).send({
      status:"FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}


async function LogActivity(type, statusCode, data, author, dateCreated) {
  await audit_logs.create({
    user_id: author,
    type: type,
    status: statusCode,
    action: JSON.stringify(data),
    createdOn: dateCreated,
  });
}

module.exports = {
  saveToken,comleteProfileDetails,
  verify,getProfileDetails,
  tokenDetails,
  signup,
  signin,
  resendEmail,
  resetPassowrdLink,
  resetPassword,
  socialSignin,
};
