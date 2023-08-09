// corsMiddleware.js
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    optionsFailureStatus: 500,
};

module.exports = cors(corsOptions);
