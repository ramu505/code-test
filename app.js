require("dotenv").config();
require("./config/db").connect();
const Cryptr = require('cryptr');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

var upload = require('express-fileupload');



const { encryption_key, JWT_KEY } = process.env;
const cryptr = new Cryptr(encryption_key)

const express = require("express");
const users = require("./model/users");

const authentication = require("./middleware/authentication");
const app = express();

app.use(upload({
    createParentPath: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.array());
app.use(express.static('public'))
//signup route
app.post("/signup", async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        let fileName = '';
        //check if file is exist in request
        if (req.files) {
            let data = [];
            let photo = req.files.photo;
            fileName = photo.name;//file name to store in users collection.
            photo.mv('./uploads/' + photo.name);
            data.push({
                name: photo.name,
                Mimetype: photo.mimetype,
                size: photo.size
            });
        }

        //validating the req body fields
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("email, password, first_name, last_name are required fields");
        }

        //validate if email already exist
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            res.status(409).send("email already exist.");
        }
        else {

            //encrypting the user password
            encrypted_pwd = await cryptr.encrypt(password);

            //insert user details into DB
            let createdUser = await users.create({
                email: email.toLowerCase(),
                password: encrypted_pwd,
                first_name,
                last_name,
                fileName
            })
            createdUser = createdUser.toJSON();
            delete createdUser.password;
            res.status(201).json(createdUser);
        }
    }
    catch (err) {
        console.log('error while signup', err);
    }
})

//signin route
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        //validating the req body fields
        if (!(email && password)) {
            res.status(400).send("email and password are required fields");
        }

        //find query on email for getting user details
        let userObj = await users.findOne({ email });
        userObj = userObj.toJSON();
        //validate if user exist and entered correct password
        if (userObj && password == cryptr.decrypt(userObj.password)) {
            //creating jwt token
            const jwt_token = jwt.sign({
                user_id: userObj._id, email
            }, JWT_KEY, {
                expiresIn: "2h"
            });
            delete userObj.password;
            userObj.jwt_token = jwt_token;
            console.log(" typeof userObj", userObj);
            res.status(200).json(userObj);
        }
        else {
            res.status(400).send("invalid credentials")
        }
    }
    catch (err) {
        console.log('error while signin', err);
    }

})

app.post("/updateuser", authentication, async (req, res) => {
    // res.status(200).send('update details');
    console.log("req.files", req.files);
    console.log("req.body", req.data);
    // console.log("req.body", req.body);
    let { user_id } = req.body;
    if (req.files) {
        let data = [];
        let photo = req.files.photo;
        req.body.fileName = photo.name;
        photo.mv('./uploads/' + photo.name);
        data.push({
            name: photo.name,
            Mimetype: photo.mimetype,
            size: photo.size
        });
    }

    delete req.body.token;
    delete req.body.user_id;
    if (req.body.password) {
        req.body.password = cryptr.encrypt(req.body.password);
    }
    console.log("req.body", req.body);
    const updateObj = { $set: req.body }
    try {
        const updatedObj = await users.findByIdAndUpdate(user_id, updateObj);
        if (!updatedObj) {
            res.status(404).send('user not found with userid ' + user_id);
        }
        else {
            res.status(204).send('update successful');
        }
    } catch (err) {
        console.log("error while update", err);
    }

})

module.exports = app;