require('dotenv').config()
const jwt = require('jsonwebtoken');
const Register = require("../model/registers");


const auth = async (req, res, next) => {
    try {
        // console.log("kumar");
        // console.log(req.cookies.jwt);
        // console.log(process.env.SECRET_KEY);
        const verifyUser = jwt.verify(req.cookies.jwt, process.env.SECRET_KEY);
        // console.log("kahli");
        const user = await Register.findOne({ _id: verifyUser._id })
        req.token=token;
        req.user=user;
        next();
    } catch (error) {
        res.status(401).send(error);
    }
}
module.exports = auth;