
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
    profileType: {
      type: Sequelize.STRING,
      allowNull: true,
    }, 
    serviceCategory: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    subServiceCategory: {
      //      type: Sequelize.TEXT('long'),
      type: Sequelize.JSON,
      allowNull: true,
    },
    ServiceSkills: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    experinceLevel: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    education: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    WorkHistory: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    achievement: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    profileOverview: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    location: {
      type: Sequelize.JSON,
      allowNull: true,
    }
  });

  return surveyReport;
};



