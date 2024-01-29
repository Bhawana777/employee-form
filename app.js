const express = require("express")
const { login, EmployeeData } = require("./mongo");
const cors = require("cors")
const multer = require("multer");
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const upload = multer({ dest: 'uploads/' });

app.get("/",cors(),(req,res)=>{

})

app.post("/",async(req,res)=>{
    const{email,password}=req.body

    try{
        const check=await login.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
        }

    }
    catch(e){
        res.json("fail")
    }

})

app.post("/signup",async(req,res)=>{
    const{email,password}=req.body

    const data={
        email:email,
        password:password
    }

    try{
        const check=await login.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await login.insertMany([data])
        }

    }
    catch(e){
        res.json("fail")
    }

})
app.post("/home", upload.single('photo'), async (req, res) => {
    const { firstName, joinDate, country, state, currency } = req.body;
    console.log("Received data:", req.body);
    const photo = req.file ? req.file.path : null;
    const newEmployeeData = new EmployeeData({ 
        firstName: firstName, 
        joinDate: joinDate, 
        country: country, 
        state: state, 
        currency: currency,
        photo: photo
    });
    console.log("New Employee Data:", newEmployeeData); 
    try {
        await newEmployeeData.save();
        const savedEmployeeData = await EmployeeData.findOne({ _id: newEmployeeData._id });
        res.status(201).json(savedEmployeeData);
        //res.status(201).send("Employee data saved successfully");
    } catch (error) {
        console.error("Error saving employee data:", error);
        res.status(500).send("An error occurred while saving employee data");
    }
});

app.listen(8000,()=>{
    console.log("port connected");
})

