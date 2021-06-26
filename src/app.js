require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
require('../src/db/conn')
const Register = require('./model/registers')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const pPath = path.join(__dirname, '../templates/partials');

app.use(express.static(staticPath))


app.set('view engine', "hbs");
app.set('views', viewsPath);

hbs.registerPartials(pPath);


// include in .gitignore to hidden the detail
// console.log(process.env.SECRET_KEY);



app.get('/', (req, res) => {
    res.render('index')
});
app.get('/register', (req, res) => {
    res.render('register')
});
app.get('/secret', auth, (req, res) => {
    // console.log(`this is cookie ${req.cookies.jwt}`);
    res.render('secret')
});
app.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.user);
        res.clearCookie('jwt');
        console.log("logout fully");
        await req.user.save();
        res.render('login');
    } catch (e) {
        res.status(500).send(e);
    }
})
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            const token = await registerEmployee.generateAuthToken();
            // console.log("the token " + token);

            //    the res.cookie() function is use to set the cookie name to value
            //  the value parameter may be a string or object converted to JSON

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 600000),
                httpOnly: true
            })

            const register = await registerEmployee.save();
            // console.log(register);
            res.status(201).render("index");
        } else {
            res.send("password not match");
        }

    } catch (e) {
        res.status(400).send(e);
    }
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;
        const userEmail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(pass, userEmail.password);

        const token = await userEmail.generateAuthToken();
        console.log("the token login " + token);

        // console.log(userEmail);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true
        });

        // console.log(`this is cookie ${req.cookies.jwt}`);   //we have just store our key we will 

        if (isMatch) {
            res.status(201).render('index');
        } else {
            res.send("Invalid login details");
        }
    } catch (e) {
        res.status(400).send("Invalid Email");
    }
})
app.listen(port, () => {
    console.log(`server start at ${port}`)
})