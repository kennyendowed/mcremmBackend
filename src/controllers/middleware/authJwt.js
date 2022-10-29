const jwt = require("jsonwebtoken");
const db = require("../../models");
const utils = require("../helpers/utils");
const User = db.user;
const Op = db.Sequelize.Op;
const User_Login = db.User_Login;
const Blacklist_Token = db.Blacklist_Token;
let token;
let re 

async function verifyToken(req, res, next) {
  // // const isTokenEmpty =
  // //   (!req.headers.authorization ||
  // //     !req.headers.authorization.startsWith('Bearer ')) &&
  // //   !(req.cookies && req.cookies.__session);
  //   if (!req.headers.authorization) {
  //     return res.status(403).send({
  //        status:"FALSE",
  //       data: [
  //         {
  //           code: 403,
  //           message: "Unauthorized Access - No Token Provided!",
  //         },
  //       ],
  //     });
  //   }
  
  //   if(req.headers.authorization){
  //     token = req.headers.authorization;
  //   }
  //   else if (req.headers.authorization.startsWith('Bearer ')) {
  //       // Read the ID Token from the Authorization header.
  //       token = req.headers.authorization.split('Bearer ')[1];
  //     } else if (req.cookies) {
  //       // Read the ID Token from cookie.
  //       token = req.cookies.__session;
  //     } 
    
  //     else if(req.headers["x-authorization"]){
  //       token=req.headers["x-authorization"];
  //     }
  //     else{
  //       token= ' ';
  //     }
  

  //   token = req.headers["authorization"].startsWith("Bearer ")
  //   ? req.headers["authorization"].split("Bearer ")[1]
  //   : req.headers["x-authorization"];

  const isTokenEmpty =  (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&  !(req.cookies && req.cookies.__session);
  if (isTokenEmpty) {
    return res.status(403).send({
      status: "FALSE",
      data: [
        {
          code: 403,
          message: "❌ Unauthorized Access 👉️ No Token Provided! ❌",
        },
      ],
    });
  }
if (
  req.headers.authorization ||
  req.headers.authorization.startsWith('Bearer ')
) {
  // Read the ID Token from the Authorization header.
  token =  req.headers.authorization.split('Bearer ')[1];
} else if (req.cookies) {
  // Read the ID Token from cookie.
  token = req.cookies.__session;
} else {
  token=req.headers["x-authorization"];
}

  await Blacklist_Token.findOne({ where: { token: token } }).then((found) => {
    if (found) {
      return res.status(401).send({
         status:"FALSE",
        data: [
          {
            code: 401,
            message: "Token blacklisted. Cannot use this token",
          },
        ],
      });
    } else {
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
        req.currentUser = decoded;
        req.userId = decoded.id;
        next();
      });
    }
  });
}

 function GetUserId(token) {
  const isTokenEmpty =
  (!token ||
    !token.startsWith('Bearer '));

 if(isTokenEmpty){
  token = ' ';
}
  else if (token.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    token = token.split('Bearer ')[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    token = req.cookies.__session;
  } 
  else if(token){
    token = token;
  }

  else {
    token=req.headers["x-authorization"];
  }

  if(token != ' '){
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return false
      
    }

    re = decoded.id;

  });
  return re
}

}

VerifyProfileStatus = async (req, res, next) => {
  var {userId ,id,email,rolesss,is_seller,profileType}=await req.currentUser;
try {
  User.findOne({
    where: {user_id: userId ,profileType :{[Op.ne] : "0"}},
  }).then((trans) => {
if(trans){
  return  res.status(403).send({
    message: "Profile updated already",
  });
}
next();
return;

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

logotToken = (req, res, next) => {
  token = req.headers["authorization"].startsWith("Bearer ")
    ? req.headers["authorization"].split("Bearer ")[1]
    : req.headers["x-authorization"];
  if (!token) {
    return res.status(403).send({
       status:"FALSE",
      data: [
        {
          code: 403,
          message: "Unauthorized Access - No Token Provided!",
        },
      ],
    });
  }

  Blacklist_Token.findOne({ where: { token: token } }).then((found) => {
    if (found) {
      return res.status(401).send({
         status:"FALSE",
        data: [
          {
            code: 401,
            message: "Token blacklisted. Cannot use this token",
          },
        ],
      });
    } else {
      jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        //  console.log(err)
        //  console.log(decoded)
        if (err) {
          return res.status(403).send({
             status:"FALSE",
            data: [
              {
                code: 403,
                message: "Unauthorized Access - No Token Provided!",
              },
            ],
          });
        }

        if (decoded) {
          var currentDate = new Date();
          var currentDateTime = utils.getcurrentDate();
          const login = await User_Login.findOne({
            where: { user_id: decoded.id ,currentDate: currentDateTime },
          });
          login.logged_out = true;
          login.token_deleted = true;
          login.logged_out_at=new Date(currentDate.getTime())
          await login.save();
          if (login.token_deleted == true) {
            const blacklist_token = Blacklist_Token.create({
              token: token,
            });
            return res.status(200).send({
               status:"TRUE",
              data: [
                {
                  code: 200,
                  message: "Logout successfully",
                },
              ],
            });
          }
        }
        req.user = decoded;
        next();
      });
    }
  });
};

isAdmin = (req, res, next) => {
  var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
     user.getRoles().then((roles) => {
       for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        status :  '0',
        data:[{
          code:  403,
          message: "You do not have the required permission to access this resource please contact admin",
           }] 
      
      });
      return;
    });
  });
};

isStaff = (req, res, next) => {
  var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "staff") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "You do not have the required permission to access this resource please contact admin",
      });
    });
  });
};

isStaffOrAdmin = (req, res, next) => {
 var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "staff") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

     
      return res.status(403).send({
         status:"FALSE",
        data: [
          {
            code: 403,
            message: "You do not have the required permission to access this resource please contact admin",
           
          },
        ],
      });
    });
  });
};

isCustomer = (req, res, next) => {
  var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "customer") {
          next();
          return;
        }
      }

     
      return res.status(403).send({
         status:"FALSE",
        data: [
          {
            code: 403,
            message: "You do not have the required permission to access this resource please contact admin",
           
          },
        ],
      });
    });
  });
};

isProvider = (req, res, next) => {
  var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "provider") {
          next();
          return;
        }
      }

      
      return res.status(403).send({
         status:"FALSE",
        data: [
          {
            code: 403,
            message: "You do not have the required permission to access this resource please contact admin",
           
          },
        ],
      });
    });
  });
};

isglobal = (req, res, next) => {
  var User_ID=GetUserId(req.headers.authorization)
  User.findByPk(User_ID).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "physician") {
          next();
          return;
        }
        if (roles[i].name === "staff") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
        if (roles[i].name === "customer") {
          next();
          return;
        }
      }

      return res.status(403).send({
         status:"FALSE",
        data: [
          {
            code: 403,
            message: "You do not have the required permission to access this resource please contact admin",
           
          },
        ],
      });
    });
  });
};
const authJwt = {
  verifyToken: verifyToken,
  logotToken: logotToken,
  isglobal:isglobal,
  isAdmin: isAdmin,
  isStaff: isStaff,
  isCustomer:isCustomer,
  isProvider:isProvider,
  isStaffOrAdmin: isStaffOrAdmin,
};
module.exports = authJwt;
