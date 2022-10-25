const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

function DDMMYYYY (date) {
    var currentDate = new Date();
    var dd = ("0" + currentDate.getDate()).slice(-2);
    var MM = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    var yyyy = currentDate.getFullYear();
  
    // var yyyy = date.getFullYear().toString();
    // var MM = getMonth(pad(date.getMonth() + 1, 2));
    // var dd = pad(date.getDate(), 2);
    
    return dd + "-" + MM + "-" + yyyy;
    };

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, req.url +"_"+ DDMMYYYY(new Date())+'.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };
