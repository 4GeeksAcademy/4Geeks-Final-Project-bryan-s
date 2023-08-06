// corsMiddleware.js
const cors = require('cors');

const corsOptions = {
    origin: 'https://hyllus478-orange-spoon-69rv4j546wxhrw9x-5001.preview.app.github.dev/photo-sharing-app-354f6',
    optionsSuccessStatus: 200,
    optionsFailureStatus: 500,
};

module.exports = cors(corsOptions);
