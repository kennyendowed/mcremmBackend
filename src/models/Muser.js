module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("muser", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companydescription: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyphoneNumber: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companycontactPersonFirstName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companycontactPersonLastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    companyprofileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_permission: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },    
    avater: {
      type: Sequelize.STRING,
      allowNull: true,
    },   
    device_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email_verify: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    phone_verify: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    phone_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    admin_status: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "Y",
    },  
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    ip_address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  });

  return User;
};








