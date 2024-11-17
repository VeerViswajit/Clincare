import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdAdd, MdClose, MdDelete, MdEdit } from "react-icons/md";
import Modal from "react-modal";
import axiosInstance from "../../utils/axiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPatient, NavBar, GreetingImage } from "@/components";
import SearchPatient from "@/components/SearchPatient";

// Define UserInfo type for user information
type UserInfo = {
  fullName: string;
  email: string;
  _id: string;
  createdOn: string;
};

// Type for form input (excluding patientId, doctor, nextAppointment, and notes)
type PatientFormData = {
  name: string;
  diagnosis: string;
  medications: string[];
  visitDate: string;
  phoneNumber: string;
  paymentMethod: string;
  totalAmount: string;
};

// Full Patient type with additional fields
type Patient = {
  patientId: string;
  name: string;
  diagnosis: string;
  medications: string[];
  visitDate: string;
  phoneNumber: string;
  paymentMethod: string;
  totalAmount: string;
  doctor: string;
  nextAppointment: string;
  notes: string;
};
const medicationsList = [
  "Acenal sp",
  "Allegra 180",
  "Allegra 120",
  "Pantosec 40",
  "Pantosec D",
  "Zerodol sp",
  "Pexonec sp",
  "Cyclofor sp",
  "Fexoden 180",
  "Camifex 180",
  "Ralpan",
  "Ralpan Dsr",
  "Derek D",
  "Mucaine gel",
  "Zenflox 200",
  "Augmentin Duo 625",
  "Clavam 625",
  "Aristomox Cv",
  "Moxclav 625",
  "Ralimox CL 625",
  "Zovimox LB",
  "Sensiclav 625",
  "Recemin 500SR",
  "Life pride 1",
  "Life pride 2",
  "Glucobay 25",
  "Glucobay 50",
  "Starmet 850",
  "Starglim 1mg",
  "Starglim 2 mg",
  "Xtor 10",
  "Tonact TG",
  "Amlopress AT",
  "Telma 20",
  "Telma 40",
  "Mediformin SR",
  "Zenflox ear drops",
  "Candid ear drops",
  "Candibiotic ear drops",
  "Waxden drops",
  "Soliwax drops",
  "Tobracam ear drops",
  "Gentison drops",
  "Nasivion s drops",
  "P 250",
  "Triz syrup",
  "Sporidex 250",
  "Clavam bid dry syrup",
  "Otogesic ear drops",
  "P 500",
  "Dolo 650",
  "Sumol 650",
  "Stablanz pv",
  "Myospaz forte",
  "A to Z",
  "Emeset 4 mg",
  "Domstal",
  "Cyclopam",
  "Sporlac DS",
  "Pregablin 50",
  "Zinkoral",
  "Zincovit",
  "Drez ointment",
  "Ointment plus",
  "Voveran emulgel",
  "Quadriderm ointment"
];


// Sample JSON for diagnoses
const diagnosesList = [
  "Hypertension",
  "Diabetes Mellitus",
  "Asthma",
  "COVID-19",
  "Bronchitis",
  "Migraine",
  "Gastroenteritis",
  "Pneumonia",
  "Anemia",
  "Arthritis",
];

const HomePage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedications, setFilteredMedications] = useState<string[]>([]);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");
  const [highlightedMedicationIndex, setHighlightedMedicationIndex] = useState<number | null>(null);
  const [highlightedDiagnosisIndex, setHighlightedDiagnosisIndex] = useState<number | null>(null);
  const [patId, setPatId] = useState<number>(1); // Initialize with the starting ID number
  const navigate = useNavigate();

  // Fetch user info on component mount if logged in
  const fetchUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) setUserInfo(response.data.user);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  // Fetch patients from the database
  const fetchPatients = async () => {
    try {
      const response = await axiosInstance.get("/get-all-patients");
      if (response.data?.patients) setPatients(response.data.patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchPatients();
  }, []);

  const onLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate("/");
  };



  const generateNextPatientId = (): string => {
    if (patients.length === 0) return "PAT001"; // Start with PAT001 if no patients exist
  
    // Extract numeric parts of patient IDs, find the max, and increment it
    const maxId = patients
      .map((patient) => parseInt(patient.patientId.replace("PAT", ""), 10))
      .reduce((max, current) => Math.max(max, current), 0);
  
    const nextId = maxId + 1;
    return `PAT${nextId.toString().padStart(3, "0")}`; // Format with leading zeros
  };
  
  const handleAddPatient = async (newPatientData: PatientFormData) => {
    const patientWithId: Patient = {
      ...newPatientData,
      patientId: generateNextPatientId(), // Dynamically generate the next unique ID
      doctor: "", // Default or fetched values as needed
      nextAppointment: "",
      notes: "",
    };
  
    try {
      const response = await axiosInstance.post("/add-patient", patientWithId);
      if (response.data?.patient) {
        setPatients((prevPatients) => [...prevPatients, response.data.patient]); // Add new patient
        setIsViewModalOpen(false);
      }
    } catch (error: any) {
      console.error("Error adding patient:", error?.response?.data?.message || error);
    }
  };
  
  

  const handleSavePatient = async () => {
    if (selectedPatient) {
      try {
        const response = await axiosInstance.put(
          `/edit-patient/${selectedPatient.patientId}`,
          selectedPatient
        );
        if (response.data?.patient) {
          setPatients((prevPatients) =>
            prevPatients.map((p) =>
              p.patientId === selectedPatient.patientId
                ? response.data.patient
                : p
            )
          );
          setIsViewModalOpen(false);
          setSelectedPatient(null);
        }
      } catch (error) {
        console.error("Error saving patient:", error);
      }
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
      setHighlightedMedicationIndex(0);
    } else {
      setFilteredMedications([]);
    }
  };

  const handleMedicationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredMedications.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedMedicationIndex((prev) =>
          prev === null || prev === filteredMedications.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedMedicationIndex((prev) =>
          prev === null || prev === 0 ? filteredMedications.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedMedicationIndex !== null) {
          const selectedMedication = filteredMedications[highlightedMedicationIndex];
          setMedicationInput(selectedMedication + " ");
          setFilteredMedications([]);
        } else if (medicationInput.trim() && selectedPatient) {
          setSelectedPatient({
            ...selectedPatient,
            medications: [...selectedPatient.medications, medicationInput.trim()],
          });
          setMedicationInput("");
        }
      }
    }
  };

  const handleDiagnosisInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim()) {
      const matches = diagnosesList.filter((diagnosis) =>
        diagnosis.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDiagnoses(matches);
      setHighlightedDiagnosisIndex(0);
    } else {
      setFilteredDiagnoses([]);
    }
  };

  const handleDiagnosisKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredDiagnoses.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedDiagnosisIndex((prev) =>
          prev === null || prev === filteredDiagnoses.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedDiagnosisIndex((prev) =>
          prev === null || prev === 0 ? filteredDiagnoses.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedDiagnosisIndex !== null && selectedPatient) {
          setSelectedPatient({
            ...selectedPatient,
            diagnosis: filteredDiagnoses[highlightedDiagnosisIndex],
          });
          setFilteredDiagnoses([]);
        }
      }
    }
  };

  const handleMedicationSelect = (medication: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        medications: [...selectedPatient.medications, medication],
      });
    }
    setFilteredMedications([]);
  };

  const handleRemoveMedication = (medication: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        medications: selectedPatient.medications.filter((med) => med !== medication),
      });
    }
  };



  const handleDeletePatient = async (patientId: string) => {
    try {
      await axiosInstance.delete(`/delete-patient/${patientId}`); // API call to delete the patient
      setPatients((prevPatients) =>
        prevPatients.filter((patient) => patient.patientId !== patientId)
      ); // Update state to remove patient
      setIsViewModalOpen(false); // Close modal
      setSelectedPatient(null); // Clear selected patient
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  
  return (
    <div>
      <NavBar userInfo={userInfo} onLogout={onLogout} />
      {userInfo && (
        <GreetingImage
          imageUrl="https://res.cloudinary.com/danghfszx/image/upload/v1731706615/img4_dah7rd.jpg"
          fullName={userInfo.fullName}
        />
      )}
      <SearchPatient searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Table>
        <TableCaption>This Month's Patients</TableCaption>
        <TableHeader>
  <TableRow>
    <TableHead className="text-lg font-bold">Patient ID</TableHead>
    <TableHead className="text-lg font-bold">Name</TableHead>
    <TableHead className="text-lg font-bold">Diagnosis</TableHead>
    <TableHead className="text-lg font-bold">Medications</TableHead>
    <TableHead className="text-lg font-bold">Visit Date</TableHead>
    <TableHead className="text-lg font-bold">Phone Number</TableHead>
    <TableHead className="text-lg font-bold">Payment Method</TableHead>
    <TableHead className="text-lg font-bold">Total Amount</TableHead>
  </TableRow>
</TableHeader>

<TableBody>
  {patients
    .filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phoneNumber.includes(searchQuery) // Include phone number in search
    )
    .map((patient) => (
      <TableRow
      key={patient.patientId}
      onClick={() => {
        setSelectedPatient(patient);
        setIsViewModalOpen(true);
      }}
      className="cursor-pointer hover:bg-gray-100 hover:text-black" // Add hover:text-black
    >
    
        <TableCell className="text-base">{patient.patientId}</TableCell>
        <TableCell className="text-base">{patient.name}</TableCell>
        <TableCell className="text-base">{patient.diagnosis}</TableCell>
        <TableCell className="text-base">{patient.medications.join(", ")}</TableCell>
        <TableCell className="text-base">
          {new Date(patient.visitDate).toLocaleString()}
        </TableCell>
        <TableCell className="text-base">{patient.phoneNumber}</TableCell>
        <TableCell className="text-base">{patient.paymentMethod}</TableCell>
        <TableCell className="text-base">{patient.totalAmount}</TableCell>
      </TableRow>
    ))}
</TableBody>

      </Table>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-blue-300 hover:bg-blue-200 transition duration-300 fixed right-10 bottom-10"
        onClick={() => setIsAddModalOpen(true)}
      >
        <MdAdd size={32} />
      </button>

      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onRequestClose={() => setIsAddModalOpen(false)}
          style={{
            overlay: { backgroundColor: "rgba(0,0,0,0.2)" },
          }}
          className="w-[40%] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll relative"
        >
          <button
            className="absolute top-3 right-3"
            onClick={() => setIsAddModalOpen(false)}
          >
            <MdClose size={24} />
          </button>
          <AddPatient onSubmit={handleAddPatient} />
        </Modal>
      )}

{isViewModalOpen && selectedPatient && (
  <Modal
    isOpen={isViewModalOpen}
    onRequestClose={() => {
      setSelectedPatient(null);
      setIsViewModalOpen(false);
    }}
    style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
    className="w-[40%] bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll relative"
  >
    <button
      className="absolute top-3 right-3"
      onClick={() => {
        setSelectedPatient(null);
        setIsViewModalOpen(false);
      }}
    >
      <MdClose size={24} />
    </button>

    {isEditMode ? (
      <>
        <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
        <Label>Name</Label>
        <Input
          placeholder="Enter name"
          value={selectedPatient.name}
          onChange={(e) =>
            setSelectedPatient({ ...selectedPatient, name: e.target.value })
          }
          required
        />

        <Label>Diagnosis</Label>
        <div className="diagnosis-input-container mb-4 relative">
          <Input
            placeholder="Enter diagnosis"
            value={selectedPatient.diagnosis}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPatient({ ...selectedPatient, diagnosis: value });
              if (value.trim()) {
                const matches = diagnosesList.filter((diagnosis) =>
                  diagnosis.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredDiagnoses(matches);
                setHighlightedDiagnosisIndex(0);
              } else {
                setFilteredDiagnoses([]);
              }
            }}
            onKeyDown={(e) => {
              if (filteredDiagnoses.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedDiagnosisIndex((prev) =>
                    prev === null || prev === filteredDiagnoses.length - 1
                      ? 0
                      : prev + 1
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedDiagnosisIndex((prev) =>
                    prev === null || prev === 0
                      ? filteredDiagnoses.length - 1
                      : prev - 1
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlightedDiagnosisIndex !== null) {
                    setSelectedPatient({
                      ...selectedPatient,
                      diagnosis: filteredDiagnoses[highlightedDiagnosisIndex],
                    });
                    setFilteredDiagnoses([]);
                  }
                }
              }
            }}
          />
          {filteredDiagnoses.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
              {filteredDiagnoses.map((diagnosis, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer ${
                    highlightedDiagnosisIndex === index
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedPatient({
                      ...selectedPatient,
                      diagnosis: diagnosis,
                    });
                    setFilteredDiagnoses([]);
                  }}
                  onMouseEnter={() => setHighlightedDiagnosisIndex(index)}
                >
                  {diagnosis}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Label>Medications</Label>
        <div className="medication-input-container mb-4 relative">
          <Input
            placeholder="Enter medication, dosage, amount"
            value={medicationInput}
            onChange={(e) => {
              const value = e.target.value;
              setMedicationInput(value);
              if (value.trim()) {
                const matches = medicationsList.filter((medication) =>
                  medication.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredMedications(matches);
                setHighlightedMedicationIndex(0);
              } else {
                setFilteredMedications([]);
              }
            }}
            onKeyDown={(e) => {
              if (filteredMedications.length > 0) {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedMedicationIndex((prev) =>
                    prev === null || prev === filteredMedications.length - 1
                      ? 0
                      : prev + 1
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedMedicationIndex((prev) =>
                    prev === null || prev === 0
                      ? filteredMedications.length - 1
                      : prev - 1
                  );
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlightedMedicationIndex !== null) {
                    setMedicationInput(filteredMedications[highlightedMedicationIndex]);
                    setFilteredMedications([]);
                  }
                }
              } else if (e.key === "Enter" && medicationInput.trim()) {
                setSelectedPatient({
                  ...selectedPatient,
                  medications: [
                    ...selectedPatient.medications,
                    medicationInput.trim(),
                  ],
                });
                setMedicationInput("");
              }
            }}
          />
          {filteredMedications.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-40 overflow-y-auto">
              {filteredMedications.map((medication, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer ${
                    highlightedMedicationIndex === index
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    setMedicationInput(medication);
                    setFilteredMedications([]);
                  }}
                  onMouseEnter={() => setHighlightedMedicationIndex(index)}
                >
                  {medication}
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedPatient.medications.map((medication, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {medication}
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() =>
                    setSelectedPatient({
                      ...selectedPatient,
                      medications: selectedPatient.medications.filter(
                        (_, i) => i !== index
                      ),
                    })
                  }
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
          value={new Date(selectedPatient.visitDate)
            .toISOString()
            .slice(0, 10)}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              visitDate: e.target.value,
            })
          }
        />

        <Label>Phone Number</Label>
        <Input
          placeholder="Phone Number"
          value={selectedPatient.phoneNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setSelectedPatient({
                ...selectedPatient,
                phoneNumber: value,
              });
            }
          }}
          maxLength={10}
        />
        {selectedPatient.phoneNumber.length > 0 &&
          selectedPatient.phoneNumber.length < 10 && (
            <p className="text-red-500 text-sm">
              Phone number must be exactly 10 digits
            </p>
          )}

        <Label>Payment Method</Label>
        <Select
          value={selectedPatient.paymentMethod}
          onValueChange={(value) =>
            setSelectedPatient({
              ...selectedPatient,
              paymentMethod: value,
            })
          }
        >
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
          value={selectedPatient.totalAmount}
          onChange={(e) =>
            setSelectedPatient({
              ...selectedPatient,
              totalAmount: e.target.value,
            })
          }
        />

        <Button
          className="mt-4 bg-green-500 text-white"
          onClick={() => {
            handleSavePatient();
            setIsEditMode(false);
          }}
        >
          Save
        </Button>
      </>
    ) : (
      <>
        <h2 className="text-xl font-bold mb-4">Patient Details</h2>
        <p>
          <strong>Name:</strong> {selectedPatient.name}
        </p>
        <p>
          <strong>Diagnosis:</strong> {selectedPatient.diagnosis}
        </p>
        <p>
          <strong>Medications:</strong> {selectedPatient.medications.join(", ")}
        </p>
        <p>
          <strong>Visit Date:</strong>{" "}
          {new Date(selectedPatient.visitDate).toLocaleString()}
        </p>
        <p>
          <strong>Phone Number:</strong> {selectedPatient.phoneNumber}
        </p>
        <p>
          <strong>Payment Method:</strong> {selectedPatient.paymentMethod}
        </p>
        <p>
          <strong>Total Amount:</strong> {selectedPatient.totalAmount}
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => setIsEditMode(true)}
          >
            <MdEdit size={24} />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeletePatient(selectedPatient.patientId)} // Use centralized delete function
          >
            <MdDelete size={24} />
          </button>
        </div>
      </>
    )}
  </Modal>
)}

    </div>
  );
};

export default HomePage;
