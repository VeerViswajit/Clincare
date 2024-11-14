const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    patientId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    diagnosis: { type: String },
    medications: { type: [String], default: [] },
    visitDate: { type: Date, default: Date.now },
    phoneNumber: { type: String },
    paymentMethod: { type: String },
    totalAmount: { type: String },
});

module.exports = mongoose.model("Patient", patientSchema);
