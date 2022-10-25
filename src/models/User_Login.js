module.exports = (sequelize, Sequelize) => {
  const User_Login = sequelize.define(
    "User_Login",
    {
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
      userID: {
        type: Sequelize.STRING,
        required: true,
      },
      logged_out: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      logged_in_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
      logged_out_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
      ip_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      currentDate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_permission: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      device: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    },
    // {
    //     indexes: [
    //       { fields: ['user_id'], unique: true }
    //     ]
    //       },
    {
      tableName: "User_Login",
    }
  );

  return User_Login;
};
