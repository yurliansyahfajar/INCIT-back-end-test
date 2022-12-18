const express = require('express');
const router = express.Router();
const connect_db  = require('../config/db.config');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

//add middleware to use bodyparser to post request
const urlencodedParser = bodyParser.urlencoded({extended:false});

//add valdiation using express validator
const { body, validationResult } = require('express-validator');

let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "0c34ff2a34d395",
        pass: "52f7567152a666"
    }
});

router.post('/signup', urlencodedParser, 
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 8 }).withMessage('must minimal 8 character'),
body('password').matches(/\d/).withMessage('must contain a number'),
body('password').matches(/[A-Z]/).withMessage('must contain an Uppercase'),
body('password').matches(/[a-z]/).withMessage('must contain a Lowercase'),
body('password').matches(/[*@!#%&()^~{}]+/).withMessage('must contain one special character '),
body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    // Indicates the success of this synchronous custom validator
    return true;
}),  
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //declare variabel to store body request
    const { email, password } = req.body

    var sql = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;
    connect_db.query(sql, function (err, result) {
        if (err){
            console.log(err);
        }else{
            // send html success login page
            res.send('Sign Up Successfull');
            //set message to email body
            transporter.sendMail({
            from: "INCIT-Backend@email.com",
            to: email,
            subject: "Subject",
            text:   "<div>" +
                    "<h1>SUCCESS SIGN UP</h1>" +
                    "<h3>Your Email : " + email + "</h3>" +
                    "<h3>Your Password : " + password + "</h3>" +
                    "<div>" 
            }, (err, info) => {
                console.log(info.envelope);
                console.log(info.messageId);
            });
        };
    });

});
   

module.exports = router;