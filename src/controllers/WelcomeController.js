const db = require("../models");
const utils = require("./helpers/utils");
const crypto = require("crypto");
const { City, State, Country } = require("akcountry-state-city");
const { Console } = require("console");
const algorithm = "aes-128-cbc";
const Securitykey = "zAL7X5AVRm8l4Ifs";
const initVector = "BE/s3V0HtpPsE+1x";
const User = db.user;
const surveyReport =db.surveyReport;
const organisationDetails =db.organisationDetails;
const Op = db.Sequelize.Op;
const sequelize =db.Sequelize;
const ServiceSkills = db.skills;
var bcrypt = require("bcryptjs");
const { resolve } = require("path");
const fs = require("fs");




async function allAccess(req, res) {
  res.status(200).json({
    status:"TRUE",
    data: [
      {
        code: 200,
        data: "Welcome to Nodejs Api Engine Application.......",
      },
    ],
  });
}

async function encrypt(req, res) {
  // generate 16 bytes of random data
  //const initVector = crypto.randomBytes(16);
  // console.log(req.body)
  // console.log(JSON.stringify(req.body))
  // protected data
  const message = JSON.stringify(req.body); // '{ firstname="akin", lastname="ade", mobile="08034743719", DOB=DateTime.Now, Gender="M", CURRENCYCODE="NGN",  ChannelID=1, ProductID=2 }';

  console.log(message);
  // secret key generate 32 bytes of random data
  // const Securitykey = crypto.randomBytes(32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding

  let encryptedData = cipher.update(message, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  console.log("Encrypted message: " + encryptedData);

  res.status(200).json({
    status:"TRUE",
    data: [
      {
        code: 200,
        data: "Encrypted message: " + encryptedData,
      },
    ],
  });
}

async function dencrypt(req, res) {
  // console.log(req.body.data);
  let encryptedData = req.body.data; //'7132d28831af9920c557a842d689e99febccbf459d709c3c5c4efeb037bb69109505d80c6cfc58bcd8338149375e59c5de2755bf50b2c18c91c26a78759b1688910dbd89309729c13db03481f4c2f4e575bdc04a78018f0845817a151ad95d8a25305ad642ff30ab9513d52164bdcb3f12b46883502c665e19b2912d1172a63ed098d51887d0d8930e2aa7d851afc439ff687f427ad2d392828d96963a27a311bbab1cf2fc71dc4c6a5b2a5b880bc445c6c1e4d07a8665716495131496b7ae34'
  // the decipher function
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  console.log("Decrypted message: " + decryptedData);
  res.status(200).json({
    status:"TRUE",
    data: [
      {
        code: 200,
        data: "Decrypted message: " + decryptedData,
      },
    ],
  });
}

async function getCountry(req, res) {
  try {
    return res.status(200).send({
      status:"TRUE",
      code: 200,
      data: Country.getAllCountries(),
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "💩 Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function getCountryState(req, res) {
  let isoCode = req.params.id;
  console.log(isoCode);
  try {
    return res.status(200).send({
      status:"TRUE",
      code: 200,
      data: State.getStatesOfCountry(isoCode),
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "💩 Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function getStateCity(req, res) {
  let countryCode = req.params.id;
  let stateCode = req.params.state;
  console.log(stateCode);
  try {
    return res.status(200).send({
      status:"TRUE",
      code: 200,
      data: City.getCitiesOfState(countryCode, stateCode),
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "💩 Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}






async function saveReport(req, res) {
  const {userId ,fullname,id,email,rolesss}=await req.currentUser;
  const {companyName ,equipment,modeType,avater,manufacturedYear,inspDate,nextInspDate,fleetNO,weight,manufacturer,capacity,location, serial,ref} = req.body;
  let avatar = req.files.avater;

   var imageAsBase64 =avatar.data;// fs.readFileSync(avatar.name);//reading file as binary data

      var base64String = new Buffer(imageAsBase64).toString("base64"); // convert to base64 string
  try{
  User.findOne({
    where: {
      companyName: companyName          
    },
    attributes: {
      exclude: ["createdAt", "updatedAt", "is_deleted"],
    }   
  }).then((data) => {
console.log(data)
  if(data !=null){
    surveyReport.create({
      user_id: data.user_id,
      ref:ref,
      companyName: companyName,
      equipment:equipment,
      sN:serial,
      modeType:modeType,
      fleetNO:fleetNO,
      manufacturer:manufacturer,
      location:location,
      capacity:capacity,
      weight:weight,
      manufacturedYear:manufacturedYear,
      avater:base64String,
      inspDate:inspDate,
      nextInspDate:nextInspDate,
      author: fullname
    }).then((data)=>{

      return res.status(200).send({
        status:"TRUE",
        message: "Report saved successfully ",
       data: [
         {
           code: 200,
           data: data,
         },
       ],
     });


    });
  }
  else{
    var ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
    const userID = utils.randomPin(8);
    const token = utils.randomPin(5); 
   const Ptoken=utils.randomChar(3, "alpha").toUpperCase() + + utils.randomChar(2, "nozero");
   
    User.create({
      user_id: userID,
      phone:"null",
      first_name:companyName,
      last_name: companyName,
      companydescription:companyName+"company",
      companyName:companyName,
      avater: process.env.APP_ASSETS_URL + "assets/defaultmale.png",
      email: "null",
      email_time: utils.addMinutes(10),
      email_code: token,
      phone_time: utils.addMinutes(20),
      phone_code: Ptoken,
      phone_verify:"1",
      is_permission: "3",
      password: bcrypt.hashSync(companyName+"@"+userID, 8),
      ip_address: ip,
    }).then((data)=>{
      surveyReport.create({
        user_id: data.user_id,
        ref:ref,
        equipment:equipment,
        companyName: companyName,
        sN:serial,
        modeType:modeType,
        fleetNO:fleetNO,
        manufacturer:manufacturer,
        location:location,
        capacity:capacity,
        weight:weight,
        manufacturedYear:manufacturedYear,
        avater:base64String,
        inspDate:inspDate,
        nextInspDate:nextInspDate,
        author: fullname
      }).then((data)=>{

        return res.status(200).send({
          status:"TRUE",
          message: "Report saved successfully ",
         data: [
           {
             code: 200,
             data: data,
           },
         ],
       });


      });
    }).catch((error)=>{
      return res.status(500).send({
        status:"FALSE",
        data: [
          {
            code: 500,
            message: "💩 Whoops, looks like something went wrong ❌",
            developerMessage: error.message,
          },
        ],
      });
    })
  } 


  });



} catch (error) {
  return res.status(500).send({
    status:"FALSE",
    data: [
      {
        code: 500,
        message: "💩 Whoops, looks like something went wrong ❌",
        developerMessage: error.message,
      },
    ],
  });
}



}

async function getReport(req,res){
  const { customer,  from_date, to_date } = req.body;
  var whereClause;
  if (!customer && !from_date && !to_date) {
    whereClause = {};
  }
   else {
    whereClause = { companyName: customer };
  }
  console.log(whereClause)
  try{
    surveyReport.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["is_deleted"],
      },
      include: [
        {
          model: User,       
          as: "organisation_details",
          attributes: ["companyName", "companydescription",  "companyphoneNumber", "companycontactPersonFirstName","companycontactPersonLastName"],
        },    
      ],
    }).then((data) => {
      if(data ==""){
        return   res.status(404).send({
          status:"FALSE",
          data: [
            {
              code: 404,
            data: "💩 No active record ❌",
            },
          ],
        });
      }else{
      return   res.status(200).send({
        status:"TRUE",
        data: data,
      });
    }
  
    });
  
  
} catch (error) {
  return res.status(500).send({
    status:"FALSE",
    data: [
      {
        code: 500,
        message: "💩 Whoops, looks like something went wrong ❌",
        developerMessage: error.message,
      },
    ],
  });
}

}



async function GetAllStatusCount(req, res) {
  var userDetail = await req.currentUser;
  var ResultCollect = [];
  try {
    ResultCollect["Allcompany"] = await User.findAndCountAll({
      where: {   is_permission: "3"},
      distinct: true,
      col: "companyName",
    });

    ResultCollect["AllDUEDate"] = await surveyReport.findAndCountAll({
      where: { nextInspDate: userDetail.department, RequestStatus: "Decline" },
      distinct: false,
      col: "initiatorStaff_id",
    });

    ResultCollect["AllApprove"] = await ReassignmentRequest.findAndCountAll({
      where: { RequestStatus: "Approve" },
      distinct: false,
      col: "initiatorStaff_id",
    });
    ResultCollect["AllDecline"] = await ReassignmentRequest.findAndCountAll({
      where: { RequestStatus: "Decline" },
      distinct: false,
      col: "initiatorStaff_id",
    });
    ResultCollect["pendingRequest"] = await ReassignmentRequest.findAndCountAll(
      {
        where: {
          initiatorStaff_id: userDetail.employeeID,
          RequestStatus: "Pending",
        },
        distinct: true,
        col: "initiatorStaff_id",
      }
    );
    ResultCollect["FinconpendingRequest"] =
      await ReassignmentRequest.findAndCountAll({
        where: { RequestStatus: "Pending" },
        distinct: false,
        col: "initiatorStaff_id",
      });
    //  console.log(ResultCollect)
    return res.status(200).send({
      status: "TRUE",
      code: 200,
      data: {
        AllHODDecline: ResultCollect.AllHODDecline,
        AllHODApprove: ResultCollect.AllHODApprove,
        Decline: ResultCollect.AllDecline,
        Approve: ResultCollect.AllApprove,
        HodPendingRequest: ResultCollect.pendingRequest,
        FinconpendingRequest: ResultCollect.FinconpendingRequest,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "❌ Whoops, looks like something went wrong ❌",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function GetallCompany(req, res) {
  try {
    //where: {RequestStatus:"Pending"},attributes:['department'],
    const Departmentresult = await User.findAll({  where: {   is_permission: "3"},
      distinct: true,
      attributes: ["companyName"],
      group: ["companyName"],
    });
    if(!Departmentresult){
      return res.status(404).send({
        status: "FALSE",
        code: 200,
        data: NULL,
      });
    }
    else{
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: Departmentresult,
      });
    }
  
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "❌ Whoops, looks like something went wrong ❌",
          developerMessage: error.message,
        },
      ],
    });
  }
}


module.exports = {
  allAccess,GetAllStatusCount,
  encrypt,GetallCompany,
  dencrypt,saveReport,
  getCountry,getReport,
  getCountryState,
  getStateCity
};
