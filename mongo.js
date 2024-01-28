const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
mongoose.connect("mongodb://0.0.0.0:27017/employee-login")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log('failed');
})

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const login = mongoose.model("collection",loginSchema)

const employeeDataSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    joinDate: { type: Date, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    currency: { type: String, required: true }
});

const EmployeeData = mongoose.model("EmployeeData", employeeDataSchema)

module.exports = {
    login: login,
    EmployeeData: EmployeeData
};

