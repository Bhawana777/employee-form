const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); 
const app = express();
const upload = multer({ dest: 'uploads/' });
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
    currency: { type: String, required: true },
    photo: { type: String } 
});

const EmployeeData = mongoose.model("EmployeeData", employeeDataSchema)

app.post("/home", upload.single('photo'), async (req, res) => {
    try {
        const { firstName, joinDate, country, state, currency } = req.body;
        
        const photo = req.file ? req.file.path : null;

        const newEmployeeData = new EmployeeData({
            firstName,
            joinDate,
            country,
            state,
            currency,
            photo 
        });

        await newEmployeeData.save();
        const savedEmployeeData = await EmployeeData.findOne({ _id: newEmployeeData._id });
        console.log("savedEmployee",savedEmployeeData);
        res.status(201).json(savedEmployeeData);
        //res.status(201).json({ success: true, message: "Employee data saved successfully" });
    } catch (error) {
        console.error('Error saving employee data:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


module.exports = {
    login: login,
    EmployeeData: EmployeeData
};

