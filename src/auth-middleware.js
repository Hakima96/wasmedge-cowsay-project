const basicAuth = require('express-basic-auth');
require('dotenv').config();

const authMiddleware = basicAuth({
    users: { [process.env.AUTH_USER]: process.env.AUTH_PASS },
    challenge: true,
    realm: 'WasmEdge Cowsay Application'
});

module.exports = authMiddleware;
