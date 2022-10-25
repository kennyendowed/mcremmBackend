const { logEvents } = require('./logEvents');

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

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, err.name +"_"+ DDMMYYYY(new Date())+'.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

module.exports = errorHandler;