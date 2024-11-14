require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
// const { default: mongoose } = require("mongoose"); 
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const {authenticateToken} = require("./utilities");
const User = require("./models/user.model");
const Patient = require("./models/patient.model");

app.use(
    cors({
        origin:"*",
    })
);

app.get("/",(req,res)=>{
    res.json({data:"Hello There"});
});


app.post("/create-account",async (req,res)=>{
    const {fullName,email,password} = req.body;

    if(!fullName){
        return res.status(400).json({error:true, message:"Full name is required"});
    }
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const isUser = await User.findOne({email:email});

    if(isUser){
        return res.json({
            error:true,
            message:"User already exists"
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn:"36000m"});

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration Sucessful",
    });
});

app.post("/login",async (req,res)=>{
    const {email,password} = req.body;

 
    if(!email){
        return res.status(400).json({error:true, message:"Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message:"Password is required"});
    }

    const userInfo = await User.findOne({email:email});

    if(!userInfo){
        return res.status(400).json({message:"User not found"});
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user:userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:"360000m",});

        return res.json({
            error:false,
            email,
            accessToken,
            message:"Login Successful",
        });
    }else{
        return res.status(400).json({
            error:true,
            message:"Invalid Credentials",
        });
    }
    
});

// Get User Details
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        // `req.user` contains the authenticated user's information from the JWT (such as `_id` and `email`)
        const { user } = req.user;

        // Find the user by email
        const isUser = await User.findOne({ id:user.id }).select("-password"); // Exclude password from the result

        if (!isUser) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }

        return res.json({
            error: false,
            user: {
                fullName: isUser.fullName,
                email: isUser.email,
                _id: isUser._id,
                createdOn: isUser.createdOn
            },
            message: "User details retrieved successfully"
        });
    } catch (error) {
        console.error("Error in /get-user:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


app.post("/add-patient", authenticateToken, async (req,res)=>{
    const {
        patientId,
        name,
        diagnosis,
        medications,
        visitDate,
        phoneNumber,
        paymentMethod,
        totalAmount,
        paymentStatus,
        doctor,
        nextAppointment,
        notes
    } = req.body;

    // Check required fields
    if (!patientId || !name) {
        return res.status(400).json({ error: "Patient ID and Name are required" });
    }

    try {
        // Check for existing patient ID to enforce uniqueness
        const existingPatient = await Patient.findOne({ patientId });
        if (existingPatient) {
            return res.status(400).json({ error:true, message: "Patient ID already exists" });
        }

        // Create new patient instance
        const newPatient = new Patient({
            patientId,
            name,
            diagnosis,
            medications: medications || [], // default to empty array if not provided
            visitDate,
            phoneNumber,
            paymentMethod,
            totalAmount,
            paymentStatus,
            doctor,
            nextAppointment,
            notes
        });

        // Save the new patient to the database
        const savedPatient = await newPatient.save();

        // Return a success response
        res.status(201).json({
            error:false,
            message: "Patient added successfully",
            patient: savedPatient
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error:true , message:"An error occurred while saving the patient"});
    }
});

app.put("/edit-patient/:patientId", authenticateToken, async (req, res) => {
    const patientId = req.params.patientId;
    const { name, diagnosis, medications, visitDate, phoneNumber, paymentMethod, totalAmount } = req.body;

    // Check if at least one field is provided for update
    if (!name && !diagnosis && !medications && !visitDate && !phoneNumber && !paymentMethod && !totalAmount) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        // Find the patient by patientId
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: true, message: "Patient not found" });
        }

        // Update the fields if they are provided in the request body
        if (name) patient.name = name;
        if (diagnosis) patient.diagnosis = diagnosis;
        if (medications) patient.medications = medications;
        if (visitDate) patient.visitDate = visitDate;
        if (phoneNumber) patient.phoneNumber = phoneNumber;
        if (paymentMethod) patient.paymentMethod = paymentMethod;
        if (totalAmount) patient.totalAmount = totalAmount;

        // Save the updated patient details
        await patient.save();

        return res.json({
            error: false,
            patient,
            message: "Patient updated successfully",
        });
    } catch (error) {
        console.error("Error in /edit-patient:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Get All Patients
app.get("/get-all-patients", authenticateToken, async (req, res) => {
    try {
        // Retrieve all patients and optionally sort them, for example, by visitDate in descending order
        const patients = await Patient.find().sort({ visitDate: -1 });

        return res.json({
            error: false,
            patients,
            message: "All patients retrieved successfully",
        });
    } catch (error) {
        console.error("Error in /get-all-patients:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


 // Delete Patient
app.delete("/delete-patient/:patientId", authenticateToken, async (req, res) => {
    const patientId = req.params.patientId;

    try {
        // Find the patient by patientId
        const patient = await Patient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ error: true, message: "Patient not found" });
        }

        // Delete the patient
        await Patient.deleteOne({ patientId });

        return res.json({
            error: false,
            message: "Patient deleted successfully",
        });
    } catch (error) {
        
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


app.listen(8000);

module.exports = app;