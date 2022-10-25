module.exports = (sequelize, Sequelize) => {
    const audit_logs = sequelize.define("audit_logs", {
      id: {
        type: Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      action: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdOn: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
      },
    });
  
    return audit_logs;
  };
  
  