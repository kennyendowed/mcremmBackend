
module.exports = (sequelize, Sequelize) => {
  const surveyReport = sequelize.define("surveyReport", {
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
    companyName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ref: {
      type: Sequelize.STRING,
      allowNull: true,
    }, 
    equipment: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sN: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    modeType: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fleetNO: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    manufacturer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    capacity: {
      type: Sequelize.STRING,
      defaultValue:`[]`,
      get: function() {
        return JSON.parse(this.getDataValue('capacity'));
    }, 
    set: function(val) {
        return this.setDataValue('capacity', JSON.stringify(val));
    },
      allowNull: true,
    },
      weight: {
      type: Sequelize.JSON,
      allowNull: true,
    },   
    manufacturedYear: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    avater: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
    }, 
    inspDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nextInspDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: true,
    }
  });

  return surveyReport;
};



