const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    optionsFailureStatus: 500,
    // Add error logging for CORS
    preflightContinue: false,
    onPreflight: (req, res, next) => {
        if (!res.headersSent) {
            next();
        } else {
            console.error("CORS preflight error for request:", req.path);
        }
    }
};

module.exports = cors(corsOptions);