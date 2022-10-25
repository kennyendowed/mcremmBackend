const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const db = require("../models");
const db2 = require("../models/index");
const nodemailer = require("nodemailer");
const utils = require("./helpers/utils");
const Beneficiary = db.Beneficiary;
const Wallet = db.Wallet;
const Transactions = db.Transactions;
const User = db.user;
const UserLogin = db.User_Login;
const Precription = db.Precriptions;
const Special_Order = db.Special_Order;
const Appointments = db.Appointments;
const Chat = db.Chat;
const PrecriptionsRequests=db.PrecriptionsRequests;
const OrderLines = db.OrderLines;
const notifications = db.notifications;
const Op = db.Sequelize;
const moment = require("moment");
var bcrypt = require("bcryptjs");
const sendMail = require("./helpers/mailSend");

async function userWallet(req, res) {
  var UserId = await req.currentUser.id;
  try {
    Wallet.findAll({
      where: {
        user_id: UserId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "is_deleted"],
      },
    }).then((data) => {
      // var Return_data = {
      //   walletInformation: {
      //     userID: data.user_id,
      //     accountType: data.account_type,
      //     accountName: data.account_name,
      //     accountnumber: data.account_number,
      //     availableBalance: data.actual_bal,
      //     totalBalance: data.lien_bal,
      //   },
      // };

      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function onlineDoctors(req, res) {
  // console.log(req.headers)
  var currentDateTime = utils.getcurrentDate();
  try {
    UserLogin.findAll({
      where: {
        [Op.or]: [
          { currentDate: currentDateTime, logged_out: "0", is_permission: "3" },
        ],
      },
      attributes: ["user_id"],
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name", "gender", "phone", "country"],
          as: "user_details",
        },
      ],
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function getuserTransaction(req, res) {
  try {
    Transactions.findAll({
      where: {
        [Op.or]: [{ account_number: req.params.id }],
      },
      attributes: [
        "user_id",
        "narrations",
        "amount",
        "account_number",
        "transactionReference",
        "type",
        "date",
      ],
      include: [
        {
          model: Wallet,
          attributes: ["account_type", "account_name", "account_number"],
          as: "wallets_details",
        },
      ],
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function funduserWallet(req, res) {
  var UserId = await req.currentUser.id;
  var users = await User.findOne({ where: { id: UserId } });
  const UserDetails = users ? users : null;
  try {
    Transactions.findOne({
      where: {
        [Op.or]: [{ transactionReference: req.body.transactionReference }],
      },
    }).then((trans) => {
      if (!trans) {
        Transactions.create({
          narrations: req.body.narrations,
          user_id: UserId,
          amount: req.body.amount,
          account_number: req.params.id,
          transactionReference: req.body.transactionReference,
          type: "credit",
          date: req.body.date,
        });

        Wallet.findOne({
          where: {
            user_id: UserId,
          },
        }).then((user) => {
          user.update({
            actual_bal: parseInt(user.actual_bal) + parseInt(req.body.amount),
            lien_bal: parseInt(user.actual_bal) + parseInt(req.body.amount),
          });
        });
        notifications.create({
          user_id: UserId,
          doctor_id: false,
          description:
            "Account funding successfully for user " +
            UserDetails.first_name +
            " " +
            UserDetails.last_name +
            " with transaction reference " +
            req.body.transactionReference,
          title: "Account funding  successfully",
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "Account Fund successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function createbeneficiary(req, res) {
  var UserId = await req.currentUser.id;
  try {
    // Save User beneficiary to Database
    Beneficiary.findOne({
      where: {
        [Op.or]: [{ number: req.body.number }],
      },
    }).then((result) => {
      if (!result) {
        Beneficiary.create({
          user_id: UserId,
          name: req.body.name,
          number: req.body.number,
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "beneficiary saved successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function getbeneficiary(req, res) {
  var UserId = await req.currentUser.id;
  try {
    // Save User beneficiary to Database
    Beneficiary.findAll({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
      attributes: ["id", "user_id", "name", "number"],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "beneficiarys  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function deletebeneficiary(req, res) {
  try {
    Beneficiary.destroy({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "beneficiarys  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "beneficiarys deleted successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function userUpdate(req, res) {
  var email = await req.currentUser.email;
  try {
    User.findOne({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "User Not found.",
            },
          ],
        });
      }
      if (req.files) {
        let avatar = req.files.avater;
        // var dir = "assets/uploads/" + email;
        // !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

        // //Use the mv() method to place the file in upload directory (i.e. "uploads")
        // avatar.mv(dir + "/" + avatar.name);
        // var prIMG = process.env.APP_ASSETS_URL + dir + "/" + avatar.name;

        var dir = "https://pharmacy.baykins.com/uploads/uploads" ;
        var prIMG = dir + "/" + avatar.name;

        //    try {
        // // Create a new form instance
        // const form = new FormData();

        //      const file =req.files.avater;
        //  form.append('file', file.buffer, file.originalname);
        //  form.append('folder', 'uploads');
        //  form.append('email', email);

        // console.log("imageeeeeeeeeeeeeeeeeeeeeee " + avatar.name)
        //     // File parsed by multer from incoming request
        //     // const Avaterfile = req.files;

        // console.log("imageeeeeeeeeeeeeeeeeeeeeee 21" + avatar.name)
        //     // Create a form and append image with additional fields

        // // const responsew =  axios.get('https://i.imgur.com/8uJcFxW.jpg', { responseType: 'stream' }).then((data) =>{
        // //   console.log(data)
        // // });

        //     // Send form data with axios
        //     const response =  axios.post('https://pharmacy.baykins.com/Fileuploads.php', form, {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //         // ...form.getHeaders(),
        //         // Authentication: 'Bearer ...',
        //       },
        //     })

        //             // axios.post("https://pharmacy.baykins.com/Fileuploads.php", {
        //             //   folder: "uploads",
        //             //   file: avatar,
        //             //   email: email
        //             // })
        //             .then(function(response) {
        //               console.log(response)
        //             }).catch(function(error) {
        //               console.log(error)
        //             })
        //    } catch (error) {
        //      console.log(error)
        //    }
      }

      user.update({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        dob: req.body.dob,
        username: req.body.username,
        phone: req.body.phone,
        avater: prIMG ?? user.avater,
        office_address: req.body.office_address,
        address: req.body.home_address,
      });
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "Account Updated successfully ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function precriptionUpdate(req, res) {
  var UserId = await req.currentUser.id;
  try {
    Precription.findOne({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Precription Not found.",
            },
          ],
        });
      }
      let ImageName;
      if (req.files) {
        let avatar = req.files.image;
        var dir = "https://pharmacy.baykins.com/uploads/prescription";
        // var dir = "assets/precription/" + UserId;
        // var path = "assets/precription/" + UserId + "/" + user.filename;
        // console.log(path);
        // if (fs.existsSync(path)) {
        //   fs.unlinkSync(path);
        // }
        // !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

        //Use the mv() method to place the file in upload directory (i.e. "uploads")
      //  avatar.mv(dir + "/" + avatar.name);
         ImageName =  dir + "/" + avatar.name;
         var fileName = avatar.name;
      }

      user.update({
        user_id: UserId,
        title: req.body.title,
        description: req.body.description,
        filename: fileName ? fileName : user.filename,
        image: ImageName
          ? ImageName
          : user.image,
      });
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "prescription Updated successfully ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function userPrecription(req, res) {
  var UserId = await req.currentUser.id;
  try {
    let ImageName;
    if (req.files) {
      let avatar = req.files.image;
      var dir = "https://pharmacy.baykins.com/uploads/prescription" ;

      // var dir = "assets/precription/" + UserId;
      // !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

      // //Use the mv() method to place the file in upload directory (i.e. "uploads")
      // avatar.mv(dir + "/" + avatar.name);
      ImageName = dir + "/" + avatar.name;
      var fileName = avatar.name;
    }
    Precription.create({
      user_id: UserId,
      phone_number: req.body.phone,
      email: req.body.email,
      title: req.body.title,
      description: req.body.description,
      filename: fileName ? fileName : null,      // ?   process.env.APP_ASSETS_URL + dir + "/" + ImageName
      image: ImageName
        ?  ImageName
        : null,
    }).then((user) => {
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "Refill request saved successfully ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function GetAlluserPrecription(req, res) {
  var UserId = await req.currentUser.id;
  try {
    Precription.findAll({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
      attributes: ["id", "user_id", "title", "image", "description"],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Precription  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function userProfile(req, res) {
  var UserId = await req.currentUser.id;
  try {
    User.findOne({
      where: {
        [Op.or]: [{ id: UserId }],
      },
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "gender",
        "dob",
        "email",
        "phone",
        "address",
        "office_address",
        "avater",
      ],
      // include: [
      //   {
      //     model: Wallet,
      //     attributes: ["account_type", "account_name", "account_number"],
      //     as: "UserAccount",
      //   },
      // ],
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function specialOrder(req, res) {
  var UserId = await req.currentUser.id;
  try {
    let ImageName;
    if (req.files) {
      let avatar = req.files.avater;
      var dir = "https://pharmacy.baykins.com/uploads/specialorder";
      // var dir = "assets/SpecialOrder/" + UserId;
      // !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

      // //Use the mv() method to place the file in upload directory (i.e. "uploads")
      // avatar.mv(dir + "/" + avatar.name);
      ImageName =  dir + "/" + avatar.name;
     var filename = avatar.name; 
    }
    Special_Order.create({
      user_id: UserId,
      name: req.body.title,
      quantity: req.body.quantity,
      filename: filename ? filename : null,
      avater: ImageName
      ?  ImageName
        // ?   process.env.APP_ASSETS_URL + dir + "/" + ImageName
        : null,
    }).then((data) => {
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "Order request saved successfully ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function GetAlluserOrders(req, res) {
  var UserId = await req.currentUser.id;
  try {
    Special_Order.findAll({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
      attributes: ["id", "user_id", "name", "avater", "quantity"],
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name", "gender", "phone", "country"],
          as: "OderUser_details",
        },
      ],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Special Order  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function FetchAppointment(req, res) {
  var UserId = await req.currentUser.id;
  var date = new Date();
  var today =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  try {
    Appointments.findAll({
      where: {
        appointment_date: {
          [Op.gt]: moment().format("YYYY-MM-DD"),
        },
        [Op.or]: [{ user_id: UserId }, { doctor_id: UserId }],
      },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "gender",
            "phone",
            "country",
          ],
          as: "user_details",
        },
        {
          model: User,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "gender",
            "phone",
            "country",
          ],
          as: "doctor_details",
        },
      ],
    }).then((result1) => {
      if (!result1) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Appointment list  not found.",
            },
          ],
        });
      }

      Appointments.findAll({
        where: {
          appointment_date: {
            [Op.lt]: moment().format("YYYY-MM-DD"),
          },
          [Op.or]: [{ user_id: UserId }, { doctor_id: UserId }],
        },
        include: [
          {
            model: User,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "gender",
              "phone",
              "country",
            ],
            as: "user_details",
          },
          {
            model: User,
            attributes: [
              "id",
              "first_name",
              "last_name",
              "gender",
              "phone",
              "country",
            ],
            as: "doctor_details",
          },
        ],
      }).then((result2) => {
        var array_result = [
          {
            upCommingAppointments: result1,
            AppointmentsHistory: result2,
          },
        ];

        return res.status(200).send({
          status: "TRUE",
          code: 200,
          data: array_result,
        });
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function bookAppointment(req, res) {
  var UserId = await req.currentUser.id;
  var users = await User.findOne({ where: { id: req.body.doctor_id } });
  const UserDetails = users ? users : null;

  var AppointmentId = utils.randomPin(5);
  try {
    Appointments.create({
      user_id: UserId,
      doctor_id: req.body.doctor_id,
      appointment_id: AppointmentId,
      appointment_date: req.body.booking_date,
      appointment_time: req.body.booking_time,
    }).then((datas) => {
      notifications.create({
        user_id: UserId,
        doctor_id: req.body.doctor_id,
        description:
          "Appointment booked successfully for " +
          req.body.booking_date +
          " @ " +
          req.body.booking_time +
          " with doctor " +
          UserDetails.first_name +
          " " +
          UserDetails.last_name,
        title: "Appointment booked successfully",
      });
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "Appointment was created successfully",
        developerMessage: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function fetchChatMessage(req, res) {
  var UserId = await req.currentUser.id;
  try {
    Chat.findAll({
      where: {
        user_id: {
          [Op.or]: [UserId, req.params.id],
        },
        reciver_id: {
          [Op.or]: [req.params.id, UserId],
        },
      },
      attributes: ["id", "user_id", "reciver_id", "message", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "last_name", "first_name", "avater"],
          as: "sender_details",
        },
        {
          model: User,
          attributes: ["id", "last_name", "first_name", "avater"],
          as: "reciver_details",
        },
        //   {
        //   model: MobileUsersConditions,
        //     //attributes: ["account_type", "account_name", "account_number","actual_bal","lien_bal"],
        //     as: "UsersConditions",
        //     include: [  {
        //       model: Conditions,
        //         //attributes: ["account_type", "account_name", "account_number","actual_bal","lien_bal"],
        //         as: "Conditions"
        //      }],
        //  },
      ],
      order: [["createdAt", "ASC"]],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Chat not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function updatePassword(req, res) {
  try {
    var UserId = await req.userId;
    User.findOne({
      where: {
        id: UserId,
      },
    }).then((user) => {
      user.update({
        password: bcrypt.hashSync(req.body.password, 8),
      });
      values = {
        email: user.email,
        name: user.name,
      };
      let title = "Reset Password Notification";
      let message =
        "\n\n Hello " +
        user.name +
        ", \n\n You are receiving this email because you just changed your account  password .  \n\nIf you did not request a password reset, please try to reset your password again  and also change the password to your personal email.  ";
      sendVerificationEmail((token = ""), values, res, title, message);
      res.status(200).send({
        status: "true",
        data: [
          {
            code: 200,
            data: "Password has been changed ",
          },
        ],
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "false",
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

async function sendVerificationEmail(token, req, res, title, message) {
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
  } catch (err) {
    return res.status(500).send({
      status: "false",
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

async function GetspecialistsVisId(req, res) {
  try {
    User.findOne({
      where: { id: req.params.id, is_permission: 3 },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "gender",
        "dob",
        "email",
        "phone",
        "address",
        "working_Time",
        "bio",
        "avater",
        "office_address",
        "specialization",
        "hospital",
        "about",
      ],
    }).then((data) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function GetAllspecialists(req, res) {
  try {
    User.findAll({
      where: { is_permission: 3 },
      attributes: [
        "id",
        "first_name",
        "last_name",
        "gender",
        "dob",
        "email",
        "phone",
        "address",
        "working_Time",
        "bio",
        "avater",
        "office_address",
        "specialization",
        "hospital",
        "about",
      ],
    }).then((data) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function getnotification(req, res) {
  var UserId = await req.currentUser.id;
  try {
    notifications
      .findAll({
        where: {
          user_id: UserId,
        },
        attributes: {
          exclude: [
            "doctor_id",
            "user_id",
            "createdAt",
            "updatedAt",
            "is_deleted",
          ],
        },
      })
      .then((data) => {
        return res.status(200).send({
          status: "TRUE",
          code: 200,
          data: data,
        });
      });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function sendChatMessage(req, res) {
  var UserId = await req.currentUser.id;
  var currentDateTime = utils.getcurrentDate();
  var roomID = utils.randomChar(10, "alnum");
  try {
    Chat.create({
      chat_id: roomID,
      user_id: UserId,
      reciver_id: req.body.reciver_id,
      message: req.body.message,
      currentDate: currentDateTime,
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "chat sent successfully",
        developerMessage: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function addTransactions(req, res){
  var UserId = await req.currentUser.id;
  let UserCart= await OrderLines.findOne({
    where: {
      order_id : req.body.orderID
    }
});

  try {
    if(UserCart){
      Transactions.upsert({
        user_id: UserId,
        order_id: req.body.orderID,
        narrations: req.body.narration,
        transactionReference: req.body.transReference,
        status: req.body.status,
        amount:req.body.amount,
        type:'credit'
      },{order_id: req.body.orderID})
    // Transactions.create({
    //     user_id: UserId,
    //     order_id: req.body.orderID,
    //     narrations: req.body.narration,
    //     transactionReference: req.body.transReference,
    //     status: req.body.status,
    //     amount:req.body.amount,
    //     type:'credit'
    //   })
      .then((data) => {
      
if(data){

  OrderLines.update( { status: '1',transactionReference:req.body.transReference },{
    where: {
      order_id: req.body.orderID
    }
});

  // await sequelize.query('update posts set param=:param where conditionparam=:conditionparam', {replacements: {param: 'parameter', conditionparam:'condition'}, type: QueryTypes.UPDATE})
}
return res.status(200).send({
  status: "TRUE",
  code: 200,
  data: "Transaction Orders stored successful",
});
      });
    }else{
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message: "product Orders not found in cart.",
          },
        ],
      });
    }
  
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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


async function getUserTransactions(req,res){
  var UserId = await req.currentUser.id;
  try {
    Transactions.findAll({
      where: {
        user_id: UserId
      },
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name", "gender", "phone", "country"],
          as: "trans_user_details",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "is_deleted"],
      },
    }).then((data) => {
         return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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


async function deletedeleteToCart(req, res) {
  try {
    OrderLines.destroy({
      where: {
       id: req.params.id 
      },
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "product not found in cart.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "product deleted successfully from cart",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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


async function FetchusersRole(req, res){
  var UserId = await req.currentUser.id;
  try {
    User.findAll({
      where: {
        is_permission:  req.params.id
      },     
      attributes: {
        exclude: ["createdAt", "updatedAt", "is_deleted","password","referral","resetPasswordToken","resetPasswordExpires","is_provider"],
      },
    }).then((data) => {
         return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function getfetchToCart(req, res){
  var UserId = await req.currentUser.id;
  try {
    OrderLines.findAll({
      where: {
        user_id: UserId,
        [Op.and]:{status : '0'}
      },
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name", "gender", "phone", "country"],
          as: "Shopping_user_details",
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "is_deleted"],
      },
    }).then((data) => {
         return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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


async function createaddToCart(req, res) {
  var UserId = await req.currentUser.id;
  var orderUUID = utils.randomPin(5);
  try {
    for (let i = 0; i < req.body.oderItems.length; i++) {
      OrderLines.create({
        user_id: UserId,
        order_id: orderUUID,
        product_uuid: req.body.oderItems[i].product_id,
        quantity: req.body.oderItems[i].quantity,
        price: req.body.oderItems[i].price,
        amount:
          parseInt(req.body.oderItems[i].price) *
          parseInt(req.body.oderItems[i].quantity),
      });
    }
    return res.status(200).send({
      status: "TRUE",
      code: 200,
      data: "Products Orders stored successful",
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function GetuserOrders(req, res) {
  try {
    Special_Order.findOne({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Special Order  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
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

async function getuserMyPrecription (req,res){
  var UserId = await req.currentUser.id;
try{
  PrecriptionsRequests.findOne({
    where: { user_id: UserId,id:req.params.id },
  })
  .then((result1) => {
    if (!result1) {
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message: "❌ Whoops, Prescription Request  not found.❌",
          },
        ],
      });
    }
    return res.status(200).send({
      status: "TRUE",
      code: 200,
      data: result1,
    });
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
async function GetuserPrecriptionRequest(req,res){
  var UserId = await req.currentUser.id;
try{
  PrecriptionsRequests.findAll({
        where: { user_id: UserId },
      })
      .then((result1) => {
        if (!result1) {
          return res.status(404).send({
            status: "FALSE",
            data: [
              {
                code: 404,
                message: "❌ Whoops, Prescription Request  not found.❌",
              },
            ],
          });
        }
        return res.status(200).send({
          status: "TRUE",
          code: 200,
          data: result1,
        });
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
async function CreatePrescription(req,res){
  var UserId = await req.currentUser.id;
  try{
    PrecriptionsRequests.findOne({
      where: { RegistrationNumber: req.body.RegistrationNumber, user_id: UserId },
    }).then((user) => {
      if (!user) {
        PrecriptionsRequests.create({
          user_id: UserId,
          name: req.body.name,
          phoneNumber: req.body.phoneNumber,
          RegistrationNumber: req.body.RegistrationNumber,
          drugs: req.body.drugs
        });
        return res.status(200).send({
          status: "TRUE",
          code: 200,
          data: "✔️ Prescription Request stored successful ✔️",
        });
      }
      else{
        return res.status(400).send({
          status: "FALSE",
          code: 400,
          data: "❌ Prescription Request With Registration Number "+req.body.RegistrationNumber+" Already Requested ❌",
        });
      }
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

async function FetchAllUsers(req,res){
  try {

  //   sequelize
  // .query('CALL login (:email, :pwd, :device)', 
  //       {replacements: { email: "me@jsbot.io", pwd: 'pwd', device: 'android', }})
  // .then(v=>console.log(v));

//:email, :pwd, :device
//  console.log(db.sequelizeTwo)
  const result = await db.sequelizeTwo.query('CALL FetchAllUsers ()',
    {
      // replacements: { status: UserId },
      type: db.sequelizeTwo.QueryTypes.SELECT,
    }
  );


    // UserLogin.findAll({
    //   // attributes: [
    //   //      ],
    //   include: [
    //     {
    //       model: User,
    //       // attributes: [],
    //       as: "user_details",
    //     },
    //   ],
    // }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "❌ Account Information Not Available.❌",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
   // });
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
  userUpdate,FetchAllUsers,
  onlineDoctors,CreatePrescription,
  sendChatMessage,GetuserPrecriptionRequest,
  userProfile,getuserMyPrecription,
  fetchChatMessage,
  deletebeneficiary,
  getbeneficiary,
  userWallet,
  funduserWallet,
  getuserTransaction,
  precriptionUpdate,
  sendVerificationEmail,
  createbeneficiary,
  userPrecription,deletedeleteToCart,
  GetAlluserOrders,
  FetchAppointment,
  updatePassword,getfetchToCart,
  GetspecialistsVisId,
  GetAlluserPrecription,FetchusersRole,
  specialOrder,
  GetuserOrders,
  bookAppointment,
  GetAllspecialists,
  getnotification,addTransactions,
  createaddToCart,getUserTransactions
};

// exports.allAccess = (req, res) => {
//   res.status(200).send("Welcome to Api Engine application.");
// };

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.staffBoard = (req, res) => {
//   res.status(200).send("Staff Content."+ req.currentUser.user_id+" welcome");
// };

// const User = require("../models/User");

// // Create and Save a new User
// exports.create = (req, res) => {
//    // Validate request
//    if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   // Create a Customer
//   const user = new User({
//     email: req.body.email,
//     name: req.body.name,
//     active: req.body.active
//   });

//   // Save Customer in the database
//   Customer.create(customer, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Customer."
//       });
//     else res.send(data);
//   });
// };

// // Retrieve all Users from the database.
// exports.findAll = (req, res) => {

// };

// // Find a single User with a UserId
// exports.findOne = (req, res) => {

// };

// // Update a User identified by the UserId in the request
// exports.update = (req, res) => {

// };

// // Delete a User with the specified UserId in the request
// exports.delete = (req, res) => {

// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {

// };
