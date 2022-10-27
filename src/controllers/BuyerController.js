const utils = require("./helpers/utils");
const db = require("../models");
const db2 = require("../models/index");
const RequestOrder = db.RequestOrder;
const moment = require("moment");

async function createRequestOrder(req, res) {
try {
  
} catch (error) {
  return res.status(500).send({
    status:"FALSE",
    data: [
      {
        code: 500,
        message: "💩 Whoops, looks like something went wrong",
        developerMessage: error.message,
      },
    ],
  });
}



}

module.exports = {
  createRequestOrder
};

  // const result = await db2.sequelize.query('SELECT * FROM tbl_users  WHERE   username = :username',
    //   {
    //     replacements: { username: username },
    //     type: db2.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // console.log(result)
