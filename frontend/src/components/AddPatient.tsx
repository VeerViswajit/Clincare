import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui';
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const AddPatient = () => {
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [medications, setMedications] = useState([]);
  const [visitDate, setVisitDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const addMedication = () => {
    if (medication.trim()) {
      setMedications([...medications, medication.trim()]);
      setMedication('');
    }
  };

  const removeMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  return (
    <div className="form-container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
      <Label className="font-semibold text-gray-700">Patient ID</Label>
      <Input
        className="input-field"
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      />

      <Label className="font-semibold text-gray-700">Name</Label>
      <Input
        className="input-field"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Label className="font-semibold text-gray-700">Diagnosis</Label>
      <Input
        className="input-field"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />

      <Label className="font-semibold text-gray-700">Medication</Label>
      <div className="medication-input-container mb-4">
        <Input
          className="input-field"
          placeholder="Enter medication and press Enter"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {medications.map((med, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
            >
              {med}
              <button
                className="text-blue-600 hover:text-blue-800"
                onClick={() => removeMedication(index)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <Label className="font-semibold text-gray-700">Visit Date</Label>
      <Input
        className="input-field"
        type="date"
        value={visitDate}
        onChange={(e) => setVisitDate(e.target.value)}
      />

      <Label className="font-semibold text-gray-700">Phone Number</Label>
      <Input
        className="input-field"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      <Label className="font-semibold text-gray-700">Payment Method</Label>
      <Select onValueChange={(value) => setPaymentMethod(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Payment Method</SelectLabel>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Gpay">Gpay</SelectItem>
            <SelectItem value="PhonePe">PhonePe</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Label className="font-semibold text-gray-700">Total Amount</Label>
      <Input
        className="input-field"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />

      <Button
        className="submit-button w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-blue-700"
        onClick={() =>
          console.log('Patient added', {
            patientId,
            name,
            diagnosis,
            medications,
            visitDate,
            phoneNumber,
            paymentMethod,
            totalAmount,
          })
        }
        disabled={!patientId || !name} // Disables the button if Patient ID or Name is empty
      >
        Add Patient
      </Button>
    </div>
  );
};

export default AddPatient;
