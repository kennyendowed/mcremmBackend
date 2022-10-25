const db = require("../models");
const Role = db.role;
const categoryService =db.services;
const appSettings = db.Basic_settings;
const Conditions = db.Conditions;
const ServiceSkills = db.skills;

// **********NOTE***********
// initial() function helps us to create 3 rows in database.
// In development, you may need to drop existing tables and re-sync database. So you can use force: true as code above.

// For production, just insert these rows manually and use sync() without parameters to avoid dropping data:
//b.sequelize.sync();
// db.sequelize.sync({ force: true }).then(() => {
// initial();
//   console.log("Drop and Resync Db");

// });




function initial() {

  Role.create({
    id: 1,
    name: "admin",
    is_permission: 1,
  });

  Role.create({
    id: 2,
    name: "staff",
    is_permission: 2,
  });

  Role.create({
    id: 3,
    name: "buyer",
    is_permission: 3,
  });

  Role.create({
    id: 4,
    name: "seller",
    is_permission: 4,
  });
}





      // Number comparisons
      // [Op.gt]: 6,                              // > 6
      // [Op.gte]: 6,                             // >= 6
      // [Op.lt]: 10,                             // < 10
      // [Op.lte]: 10,                            // <= 10
      // [Op.between]: [6, 10],                   // BETWEEN 6 AND 10
      // [Op.notBetween]: [11, 15],               // NOT BETWEEN 11 AND 15



      