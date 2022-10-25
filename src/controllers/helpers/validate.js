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

//wallet creation verify
const walletInputValidation = (data) => {
  const schema =Joi.object({
    narrations: Joi.string().min(3).required(),
    amount: Joi.number().required(),
    transactionReference: Joi.string().min(1).required(),
      date: Joi.string().required(),
 
  });
 
     return schema.validate(data);
};
//beneficiary Validation
const beneficiaryValidation = (data) => {
  const schema =Joi.object({
    name: Joi.string().min(3).required(),
    number: Joi.number().min(10).required(),
 
  });
 
     return schema.validate(data);
}
//Social Login Validation
const SocialLoginValidation = (data) => {
  const schema =Joi.object({
    provider: Joi.string().min(3).required(),
    provider_id: Joi.number().unsafe().min(10).required(),
    email: Joi.string().min(6).email().required(),
  });
 
     return schema.validate(data);
}

//Category Input Validation
const CategoryInputValidation = (data) => {
  const schema =Joi.object({
    name: Joi.string().min(3).required().messages({
      'any.required': 'Category {{#label}} is required',
      'string.empty': 'Category {{#label}} is can not be empty',
    }),
 
  });
 
     return schema.validate(data);
}

//Product in put validation
const ProductInputValidation =(data)=>{
  const schema =Joi.object({
    name: Joi.string().min(3).required().messages({
      'any.required': 'Category {{#label}} is required',
      'string.empty': 'Category {{#label}} is can not be empty',
    }),
    description: Joi.string().min(3).required(),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
    // avater:Joi.required().messages({
    //   'any.required': 'Product {{#label}} is required',
    //   'string.empty': 'Product {{#label}} is can not be empty',
    // })
  });
 
     return schema.validate(data);
}

const skillsInputValidation =(data)=>{
  const schema =Joi.object({
    title: Joi.string().min(3).required().messages({
      'any.required': 'skill  {{#label}} is required',
      'string.empty': 'skill {{#label}} is can not be empty',
    })   
  });
 
     return schema.validate(data);
}

module.exports={
  ProductInputValidation,skillsInputValidation, CategoryInputValidation,changePasswordValidation, SocialLoginValidation,beneficiaryValidation,walletInputValidation,saveTokenValidation,registerValidation,loginValidation,otpValidation,ResendOtpValidation,passwordResetValidation
};
