const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports.checkUser = (req, res, next)=> {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, async(err,docodedToken)=>{

            if(err){
                res.locals.user = null;
                res.cookie('jwt', '', {maxAge: 1});
                console.log("pas de cookies et erreur")
                next();
            }else { 
                let user = await userModel.findById(docodedToken.id);
                res.locals.user = user;
                console.log(token);
                console.log("--"+user);
                next();
            }
        })
    }else {
        res.locals.user = null;
        console.log("pas de cookies")
        next();
    }
}

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt ;
    if(token){
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken)=>{
            if(err){
                console.log(err);
            }else {
                console.log(decodedToken.id);
                res.status.json(decodedToken.id)
                next();
            }
        });
    }else {
        console.log('no token');
    }
}