
const dotenv=require('dotenv');
dotenv.config();

module.exports = {
    HOST:   process.env.DB_HOST,
    USER:     process.env.DB_USERNAME,
    PASSWORD:     process.env.DB_PASSWORD,
    DB:   process.env.DB_DATABASE,
    HOSTTwo:   process.env.DB_HOSTTwo,
    USERTwo:     process.env.DB_USERNAMETwo,
    PASSWORDTwo:     process.env.DB_PASSWORDTwo,
    DBTwo:   process.env.DB_DATABASETwo,
    dialect:   process.env.DB_CONNECTION,
    operatorsAliases:process.env.OPERATOR_ALIASES,
    dialectOptions: {
      ssl: false,
      native:false
    },
    pool: {
      max:parseInt(process.env.POOL_MAX),
      min: parseInt(process.env.POOL_MIN),
      acquire: parseInt(process.env.POOL_ACQUIRE),
      idle:  process.env.POOL_IDLE
    },
  //   tunnelSSH: {
  //     user: process.env.TUNNEL_USER,
  //     host: process.env.TUNNEL_SSH_HOST,
  //     port: process.env.TUNNEL_PORT,
  //     dstHost: process.env.TUNNEL_DST_HOST,
  //     dstPort: process.env.TUNNEL_DST_PORT,
  //     srcHost: process.env.TUNNEL_SRC_HOST,
  //     srcPort: process.env.TUNNEL_SRC_PORT,
  //     localHost: process.env.TUNNEL_LOCAL_HOST,
  //     localPort: process.env.TUNNEL_LOCAL_PORT,
  // }
  };