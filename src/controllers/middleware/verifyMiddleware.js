const db = require("../../models");
const utils = require("../helpers/utils");
const jwt = require("jsonwebtoken");
const {
  
  changePasswordValidation,
   SocialLoginValidation,InputValidation,
  saveTokenValidation,
  passwordResetValidation,
  registerValidation,
  otpValidation,
  loginValidation,
  ResendOtpValidation,
} = require("../helpers/validate");
const ROLES = db.role;
const Op = db.Sequelize.Op;
const Products = db.Products;
const Categorys = db.Categorys;
const User = db.user;
const ServiceSkills = db.skills;
var currentDate = new Date();
var bcrypt = require("bcryptjs");
var currentDateTime = new Date(currentDate.getTime());
var datetimedata = currentDateTime.toLocaleString("en-US", {
  timeZone: "Africa/Lagos",
});

VverifyEmail = (req, res, next) => {
  var currentDate = new Date();
  var currentDateTime = new Date(currentDate.getTime());
  var datetimedata = currentDateTime.toLocaleString("en-US", {
    timeZone: "Africa/Lagos",
  });

  const { error } = ResendOtpValidation(req.body);

  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.emailOrPhone },{ phone: req.body.emailOrPhone }]
    },
  }).then((response) => {
    if (!response) {
      res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "Data not found",
          },
        ],
      });
      return;
    }

    if(response.email == req.body.emailOrPhone){
      var myTIME = response.email_time.toLocaleString("en-US", {
        timeZone: "Africa/Lagos",
      });
      const d = datetimedata;
      const fi = d.split(" ")[0];
      const dd = myTIME;
      const fii = d.split(" ")[0];
      if (fii == fi && myTIME > datetimedata) {
        res.status(404).send({
           status: "0",
          data: [
            {
              code: 404,
              message:
                " Please Try Again. After " +
                utils.differhuman(response.email_time),
            },
          ],
        });
        return;
      }
    }
    if(response.phone == req.body.emailOrPhone){
      var myTIME = response.phone_time.toLocaleString("en-US", {
        timeZone: "Africa/Lagos",
      });
  
      if (myTIME > datetimedata) {
      return  res.status(422).send({
           status: "0",
          data: [
            {
              code: 422,
              message:
                " Please Try Again. After " +
                utils.differhuman(response.phone_time),
            },
          ],
        });
        return;
      }
    }
  
    next();
  });
};

VerifypasswordReset = (req, res, next) => {
  const { error } = passwordResetValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });
  User.findOne({
    where: {
      resetPasswordToken: req.body.token,
    },
  }).then((response) => {
    if (!response) {
      res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "Token  is incorrect",
          },
        ],
      });
      return;
    }
    next();
  });
};

VerifysaveToken = (req, res, next) => {
  const { error } = saveTokenValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  next();
};

verifySocialLogin = (req, res, next) => {
  const { error } = SocialLoginValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  next();
};

verifyRegister = (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  next();
};

verifyLogin = (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  next();
};
verifyResendOtp = (req, res, next) => {
  var currentDate = new Date();
  var currentDateTime = new Date(currentDate.getTime());
  var datetimedata = currentDateTime.toLocaleString("en-US", {
    timeZone: "Africa/Lagos",
  });
  const { error } = ResendOtpValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  User.findOne({
    where: {
      [Op.or]: [{ email: req.body.emailOrPhone },{ phone: req.body.emailOrPhone }]
    },
  }).then((response) => {
    if (!response) {
      res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "Account Record Not Found",
          },
        ],
      });
      return;
    }
     if(response.email == req.body.emailOrPhone){
    var myTIME = response.email_time.toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

    if (myTIME > datetimedata) {
      return  res.status(422).send({
         status: "0",
        data: [
          {
            code: 422,
            message:
              " Please Try Again. After " +
              utils.differhuman(response.email_time),
          },
        ],
      });
      return;
    }
  }
  if(response.phone == req.body.emailOrPhone){
    var myTIME = response.phone_time.toLocaleString("en-US", {
      timeZone: "Africa/Lagos",
    });

    if (myTIME > datetimedata) {
    return  res.status(422).send({
         status: "0",
        data: [
          {
            code: 422,
            message:
              " Please Try Again. After " +
              utils.differhuman(response.phone_time),
          },
        ],
      });
      return;
    }
  }
    next();
  });
};
checkOtp = async (req, res, next) => {
  const { error } = otpValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });
    const verifyCode= await User.findOne({ where: {  [Op.or]: [{ email_code: req.body.code  }, { phone_code: req.body.code  }]  }});
     if (!verifyCode) {
      res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "Otp Not found please make a new request",
          },
        ],
      });
      return;
    }

    if (verifyCode.email_code == req.body.code && Date.parse(verifyCode.email_time) < Date.parse(datetimedata)) {
        return  res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "email otp expired please make a new request",
          },
        ],
      });
      return;
    
  }
  else{
    if (verifyCode.phone_time < datetimedata) {
   
   return   res.status(404).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "phone number otp expired please make a new request",
          },
        ],
      });
      return;
    }
  }
   

    next();

};

async function VerifyLoginActive(req, res, next){

    var Useremail =req.body.email;
    console.log(Useremail)
    User.findOne({
      where: {
        [Op.or]: [{ email: Useremail },{ phone: Useremail }],
        admin_status:'Y'
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
           status: "0",
          data: [
            {
              code: 400,
              message: "Failed! Account Blocked Please Contact Admin!",
            },
          ],
        });
        return;
      }
 
  
      next();
    });
  
 
}


async function VerifyActive(req, res, next){
   
  const isTokenEmpty =
  (!req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')) &&
  !(req.cookies && req.cookies.__session);

 if(isTokenEmpty){
  token = ' ';
}
  else if (req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    token = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    token = req.cookies.__session;
  } 
  else if(req.headers.authorization){
    token = req.headers.authorization;
  }

  else {
    token=req.headers["x-authorization"];
  }

  if(token != ' '){
  jwt.verify(token, process.env.SECRET,async (err, decoded) => {
    if (err) {
      return res.status(401).send({
         status: "0",
        data: [
          {
            code: 401,
            message: "❌Unauthorized Access 👉️  Invalid Token Provided!❌",
          },
        ],
      });
    }
    let UserEmail = decoded.email;
  var Useremail =(req.body.email) ? req.body.email : UserEmail;
  const verifyEmail= await User.findOne({ where: {  [Op.or]: [{ phone: Useremail }, { email: Useremail }],email_verify:"0" }});
  const verifyPhone= await User.findOne({ where: {  [Op.or]: [{ phone: Useremail }, { email: Useremail }],phone_verify:"0" }});

  

    if (verifyPhone) {
      return res.status(400).send({
          status: "0",
         data: [
           {
             code: 400,
             message: "❌Failed! 👉️  Phone number Unverify !❌",
           },
         ],
       });
     }
     else if(verifyEmail){
       return res.status(400).send({
          status: "0",
         data: [
           {
             code: 400,
             message: "❌Failed! 👉️  Email Unverify !❌",
           },
         ],
       });
     }
    
   
    User.findOne({
      where: {
        [Op.or]: [{ phone: Useremail }, { email: Useremail }],
        admin_status:'Y'
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
           status: "0",
          data: [
            {
              code: 400,
              message: "Failed! Account Blocked Please Contact Admin!",
            },
          ],
        });
        return;
      }

  
      next();
    });

    
  });
  }
  else if(token === ' '){
    return res.status(401).send({
       status: "0",
      data: [
        {
          code: 401,
          message: "Unauthorized Access - Invalid Token Provided!",
        },
      ],
    });
  }
  else{
    var Useremail =req.body.email;
    User.findOne({
      where: {
        email: Useremail,admin_status:'N'
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
           status: "0",
          data: [
            {
              code: 400,
              message: "Failed! Account Blocked Please Contact Admin!",
            },
          ],
        });
        return;
      }
  
  
      next();
    });
  }
 
}

async function checkDuplicateUsernameOrEmail  (req, res, next) {
  const userphoneexists = await User.findOne({ where: {phone: req.body.phone } });
  const useremailexists = await User.findOne({ where: {email: req.body.email } });

  const { error } = registerValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });
  

    if (userphoneexists) {
     return res.status(400).send({
         status: "0",
        data: [
          {
            code: 400,
            message: "Failed! Phone number is already in use!",
          },
        ],
      });
    }
    else if(useremailexists){
      return res.status(400).send({
         status: "0",
        data: [
          {
            code: 400,
            message: "Failed! Email is already in use!",
          },
        ],
      });
    }
    next();
  
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
           status: "0",
          data: [
            {
              code: 400,
              message: "Failed! Role does not exist = " + req.body.roles[i],
            },
          ],
        });
        return;
      }
    }
  }
  next();
};

verifyInput = (req, res, next) => {
  const { error } = InputValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  next();
};



async function ChangePassword(req, res, next) {
  var UserId = await req.userId;

  const { error } = changePasswordValidation(req.body);
  if (error)
    return res.status(400).json({
       status: "0",
      data: [
        {
          code: 400,
          message: error.details[0].message,
        },
      ],
    });

  // Username
  User.findOne({
    where: {
      id: UserId,
    },
  }).then((user) => {
    if (user) {
      var passwordIsValid = bcrypt.compareSync(
        req.body.oldpassword,
        user.password
      );
      if (!passwordIsValid) {
        res.status(400).send({
           status: "0",
          data: [
            {
              code: 400,
              message: "Failed! Invalid Password!",
            },
          ],
        });
        return;
      }
    } else {
      res.status(400).send({
         status: "0",
        data: [
          {
            code: 404,
            message: "Failed! NOt found!",
          },
        ],
      });
    }
    next();
  });
}



const verifyMiddleware = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  VerifyOtp: checkOtp,
  VerifyActive:VerifyActive,
  VerifyLoginActive:VerifyLoginActive,
  Verifysignin: verifyLogin,
  verifyRegister: verifyRegister,
  VerifyEmail: VverifyEmail,
  VerifyChangePassword: ChangePassword,
  VerifypasswordReset: VerifypasswordReset,
  VerifyResendOtp: verifyResendOtp,
  VerifysaveToken: VerifysaveToken,
  verifyInput: verifyInput,
  verifySocialLogin: verifySocialLogin,
  VerifyProfileStatus:VerifyProfileStatus
};

module.exports = verifyMiddleware;
