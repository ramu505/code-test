const jwt = require("jsonwebtoken");

const { JWT_KEY } = process.env;// jwt key fetching from .env file

//jwt verification middleware
const token_verification = (req, res, next) => {

    //fetching jwt from req body/query params
    const req_jwt = req.body.token || req.query.token;

    //validationg if jwt available or not in req
    if (!req_jwt) {
        return res.status(403).send("authentication token missing");
    }

    try {
        const decodedUserInfo = jwt.verify(req_jwt, JWT_KEY);
        req.user = decodedUserInfo;
    } catch (err) {
        return res.status(401).send("Invalid token")
    }
    return next();
}

module.exports = token_verification;