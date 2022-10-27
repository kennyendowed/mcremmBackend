const Joi=require('@hapi/joi');
const customJoi = Joi.extend(require("joi-age"));



//change pasddword
const changePasswordValidation = (data)=>{
  const schema =Joi.object({
    oldpassword: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
      'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
      'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol eg @$!%*?/,;_+#&',
    }),
  password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
    'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
    'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol eg @$!%*?/,;_+#&',
  }),       
password_confirmation: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match'} })
});

   
return schema.validate(data);
};
//Register validation
const registerValidation= (data) =>{
    const schema =Joi.object({
        email: Joi.string().min(6).email().required(),    
        lastname: Joi.string().min(3).required(),   
        firstname: Joi.string().min(3).required(),
        phone: Joi.number().required(),     
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(20).required().messages({
       // password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),
          confirmPwd: Joi.any().equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match'} })    
      });
   
       return schema.validate(data);
};

//Login validation
const loginValidation= (data) =>{
    const schema =Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(20).required().messages({
            'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
            'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
          }),       
    });
   
       return schema.validate(data);
};

//Otp validation
const otpValidation= (data) =>{
  const schema =Joi.object({
      code: Joi.string().required()
      .messages({
      "string.empty": `hello {{#label}} cannot be an empty field`,
      'any.required': 'chief {{#label}} is required',
        }),       
  });
 
     return schema.validate(data);
};

//saveToken Validation
const saveTokenValidation =(data)=>{
  const schema =Joi.object({
    DeviceToken: Joi.string().required(),     
});

   return schema.validate(data);
};

//ResendOtp Validation
const ResendOtpValidation =(data)=>{
  const schema =Joi.object({
    emailOrPhone: Joi.string().required(),     
});

   return schema.validate(data);
};

//password rest Validation
const passwordResetValidation =(data)=>{
  const schema =Joi.object({
    token: Joi.string().min(4).required(),   
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/,;_+#&])[A-Za-z\d@$!%*?/,;_+#&]{8,}$/,'password').min(6).max(15).required().messages({
      'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
      'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern {{#label}} must contain at least 1 lower-case and capital letter, a number and symbol',
    }),       
  password_confirmation: Joi.any().equal(Joi.ref('password'))
      .required()
      .label('Confirm password')
      .options({ messages: { 'any.only': '{{#label}} does not match'} })  
});

   return schema.validate(data);
};



//Social Login Validation
const SocialLoginValidation = (data) => {
  const schema =Joi.object({
    provider: Joi.string().min(3).required(),
    provider_id: Joi.number().unsafe().min(10).required(),
    email: Joi.string().min(6).email().required(),
  });
 
     return schema.validate(data);
}




const InputValidation =(data)=>{
  const schema =Joi.object({
    companyName: Joi.string().min(3).required().messages({
      'any.required': 'customer name is required',
      'string.empty': 'customer name  is can not be empty',
    }),
    weight: Joi.string().optional().allow(''),
    equipment: Joi.string().required(),
    ref: Joi.string().required().messages({
      'any.required': 'reference number is required',
      'string.empty': 'reference number  is can not be empty',
    }),
    serial: Joi.string().required().messages({
      'any.required': 'serial number is required',
      'string.empty': 'serial number  is can not be empty',
    }),
    modeType: Joi.string().required().messages({
      'any.required': 'model / type is required',
      'string.empty': 'model / type is can not be empty',
    }),
    fleetNO: Joi.string().required().messages({
      'any.required': 'fleet number is required',
      'string.empty': 'fleet number  is can not be empty',
    }),
    avater: Joi.string().optional().allow(''),
   manufacturedYear: Joi.string().required().messages({
    'any.required': 'manufactured year is required',
    'string.empty': 'manufactured year  is can not be empty',
  }),
    // payeeAddress: Joi.string().optional().allow(''),
    location: Joi.string().required(),
    manufacturer: Joi.string().required(),
    capacity: Joi.string().required(),
    nextInspDate: Joi.string().required().messages({
      'any.required': 'next inspection date is required',
      'string.empty': 'next inspection date  is can not be empty',
    }),
    inspDate: Joi.string().required().messages({
      'any.required': 'inspection date is required',
      'string.empty': 'inspection date is can not be empty',
    }),  
  });
 
     return schema.validate(data);
}

module.exports={
changePasswordValidation,InputValidation, SocialLoginValidation,saveTokenValidation,registerValidation,loginValidation,otpValidation,ResendOtpValidation,passwordResetValidation
};
