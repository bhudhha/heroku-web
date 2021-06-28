const express = require('express');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connection successful");
}).catch((e) => {
    console.log(e);
})
