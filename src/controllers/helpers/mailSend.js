const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path')

let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_DRIVER,
    port:  process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD 
    },
  });

//   // point to the template folder
const handlebarOptions = {
  viewEngine: {
      partialsDir: path.resolve('./views/mails/'),
      defaultLayout: false,
  },
  viewPath: path.resolve('./views/mails/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


const sendMail = (template,name,email, from,  subject, text) => {
    const mailOptions = {
      from:from, // TODO: email sender
      replyTo:process.env.MAIL_REPLY_TO,
      to:  email, // TODO: email receiver
      cc: "",
      bbc:"",
      subject: subject,
      text: text,
       template: template,
      context: {
        name: name,
        message:text
    } ,
    attachments: [{ filename: "log.png", path: "./assets/log.png" }],
    // send extra values to template
    };
  

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
       console.log(err)
            return err;
        }
        console.log(data)
        return  data;
  
    });
}

module.exports = sendMail;