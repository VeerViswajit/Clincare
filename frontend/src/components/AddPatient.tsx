import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample medications list for suggestions
const medicationsList = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Metformin",
  "Atorvastatin",
  "Azithromycin",
  "Lisinopril",
  "Clopidogrel",
  "Prednisone",
];

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
  const [name, setName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicationInput, setMedicationInput] = useState("");
  const [medications, setMedications] = useState<string[]>([]);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10)); // Today's date as default
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [filteredMedications, setFilteredMedications] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numeric values and restrict to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleMedicationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMedicationInput(value);

    if (value.trim()) {
      const matches = medicationsList.filter((medication) =>
        medication.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedications(matches);
      setHighlightedIndex(0); // Reset highlighted index
    } else {
      setFilteredMedications([]);
    }
  };

  const handleMedicationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredMedications.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev === null || prev === filteredMedications.length - 1
            ? 0
            : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev === null || prev === 0 ? filteredMedications.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex !== null) {
          setMedicationInput(filteredMedications[highlightedIndex] + " ");
          setFilteredMedications([]);
        } else if (medicationInput.trim()) {
          setMedications([...medications, medicationInput.trim()]);
          setMedicationInput("");
        }
      }
    } else if (e.key === "Enter" && medicationInput.trim()) {
      setMedications([...medications, medicationInput.trim()]);
      setMedicationInput("");
    }
  };

  const handleMedicationSelect = (medication: string) => {
    setMedicationInput(medication + " ");
    setFilteredMedications([]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
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
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Label>Diagnosis</Label>
      <Input
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={(e) => setDiagnosis(e.target.value)}
      />

      <Label>Medications</Label>
      <div className="medication-input-container mb-4 relative">
        <Input
          placeholder="Enter medication and press Enter"
          value={medicationInput}
          onChange={handleMedicationInput}
          onKeyDown={handleMedicationKeyDown}
        />
        {filteredMedications.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
            {filteredMedications.map((medication, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer ${
                  highlightedIndex === index ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleMedicationSelect(medication)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {medication}
              </li>
            ))}
          </ul>
        )}
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

      <Label>Visit Date</Label>
      <Input
        type="date"
        value={visitDate}
        onChange={(e) => setVisitDate(e.target.value)}
      />

      <Label>Phone Number</Label>
      <Input
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        maxLength={10}
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
      <Input
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(e.target.value)}
      />

      <Button
        className="submit-button w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-6 hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={!name || phoneNumber.length !== 10}
      >
        Add Patient
      </Button>
    </div>
  );
};

export default AddPatient;
