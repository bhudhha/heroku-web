const express = require('express');
const mongoose = require('mongoose');

// const MONGODB_URL='mongodb+srv://Rahul_user:rahulkumar@rahul.qsswr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

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
