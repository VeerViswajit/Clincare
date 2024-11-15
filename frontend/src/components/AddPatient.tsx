import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

// Define PatientFormData without `patientId`, `doctor`, `nextAppointment`, and `notes`
interface PatientFormData {
  name: string;
  diagnosis: string;
  medications: string[];
  visitDate: string;
  phoneNumber: string;
  paymentMethod: string;
  totalAmount: string;
}

// Props for AddPatient component using PatientFormData
interface AddPatientProps {
  onSubmit: (data: PatientFormData) => void;
}

const AddPatient: React.FC<AddPatientProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [medication, setMedication] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10)); // Today's date as default
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const addMedication = () => {
    if (medication.trim()) {
      setMedications([...medications, medication.trim()]);
      setMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric values and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleSubmit = () => {
    if (phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    
    onSubmit({
      name,
      diagnosis,
      medications,
      visitDate,
      phoneNumber,
      paymentMethod,
      totalAmount,
    });
  };

  return (
    <div className="form-container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
      <Label>Name</Label>
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />

      <Label>Diagnosis</Label>
      <Input placeholder="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

      <Label>Medications</Label>
      <div className="medication-input-container mb-4">
        <Input
          placeholder="Enter medication and press Enter"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {medications.map((med, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
              {med}
              <button className="text-blue-600 hover:text-blue-800" onClick={() => removeMedication(index)}>
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <Label>Visit Date</Label>
      <Input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />

      <Label>Phone Number</Label>
      <Input
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        maxLength={10} // Limit input to 10 characters
      />
      {phoneNumber.length > 0 && phoneNumber.length < 10 && (
        <p className="text-red-500 text-sm">Phone number must be exactly 10 digits</p>
      )}

      <Label>Payment Method</Label>
      <Select onValueChange={(value) => setPaymentMethod(value)}>
        <SelectTrigger className="w-full">
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

      <Label>Total Amount</Label>
      <Input placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />

      <Button
        className="submit-button w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={!name || phoneNumber.length !== 10} // Disable if phone number is not 10 digits
      >
        Add Patient
      </Button>
    </div>
  );
};

export default AddPatient;
