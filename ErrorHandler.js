class ErrorHandler extends Error{
    constructor(message, status){
        super();
        this.message = message;
        this.status = status;
        // this.status = `${status}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true;
        // Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;