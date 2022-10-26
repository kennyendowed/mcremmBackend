// const sql= require("./db.js");
const fs = require("fs");
const path = require("path");
const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const tunnel = require("tunnel-ssh");
const { Client } = require("ssh2");
const conn = new Client();

//database wide options
var opts = {
  define: {
    //prevent sequelize from pluralizing table names
    freezeTableName: true,
  },
};
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: config.operatorsAliases,
  dialectOptions: {
    // "ssl": {
    //   "require":config.dialectOptions.ssl,
    //   "rejectUnauthorized": config.dialectOptions.native
    // }
  },
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  define: {
    timestamps: true,
    freezeTableName: false,
  },
  logging: console.log,
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.log("❌Unable to connect to the database: ❌ : ", err.message);
    });
} catch (error) {
  var respo = [
    {
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "❌" + error.message + " ❌",
        },
      ],
    },
  ];

  console.log(...respo);
  return respo;
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.audit_logs = require("../models/audit_logs.js")(sequelize, Sequelize);
db.user = require("./Muser.js")(sequelize, Sequelize);
db.surveyReport = require("../models/surveyReport.js")(sequelize, Sequelize);
db.User_Login = require("../models/User_Login.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);
// db.individualDetails = require("../models/individualDetails.js")(sequelize, Sequelize);
// db.organisationDetails = require("../models/organisationDetails.js")(sequelize, Sequelize);
db.Blacklist_Token = require("../models/Blacklist_Token.js")(
  sequelize,
  Sequelize
);
// db.services =require("../models/services.js")(sequelize, Sequelize);
// db.skills =require("../models/skills.js")(sequelize, Sequelize);
// db.RequestOrder=require("../models/RequestOrder.js")(sequelize, Sequelize);

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "is_permission",
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "is_permission",
  otherKey: "userId",
});

db.User_Login.belongsTo(db.user, {
  as: "user_details",
  foreignKey: "user_id",
  constraints: false,
});

db.surveyReport.belongsTo(db.user, {
  as: "organisation_details",
  foreignKey: "user_id",
  targetKey: "user_id",
  constraints: false
});

// db.user.belongsTo(db.individualDetails, {
//   as: "individualdetails",
//   foreignKey: "user_id",
//   targetKey: "user_id",
//   constraints: false
// });

// db.user.belongsTo(db.organisationDetails, {
//   as: "organisation_details",
//   foreignKey: "user_id",
//   targetKey: "user_id",
//   constraints: false
// });



// db.organisationDetails.belongsTo(db.services, {
//   as: "service_details",
//   foreignKey: "serviceCategory",
//   targetKey: "name",
//   constraints: false
// });

db.ROLES = ["admin", "staff", "customer"];

module.exports = db;
