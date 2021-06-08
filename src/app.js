const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
require('../src/db/conn')
const Register = require('./model/registers')
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const pPath = path.join(__dirname, '../templates/partials');
app.use(express.static(staticPath))


app.set('view engine', "hbs");
app.set('views', viewsPath);

hbs.registerPartials(pPath);

app.get('/', (req, res) => {
    res.render('index')
});
app.get('/register', (req, res) => {
    res.render('register')
});
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
            const register=await registerEmployee.save();
            res.status(201).render("index");
        } else {
            res.send("password not match");
        }

    } catch (e) {
        res.status(400).send(e);
    }
})
app.listen(port, () => {
    console.log(`server start at ${port}`)
})