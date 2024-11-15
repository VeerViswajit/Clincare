import { AddPatient, NavBar } from '@/components';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdAdd, MdClose, MdDelete, MdEdit } from 'react-icons/md';
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const HomePage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  // Handle logout
  const onLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate("/");
  };

  // Function to generate the next patient ID
  const generateNextPatientId = () => {
    if (patients.length === 0) return "PAT001";
    const lastPatientId = patients[patients.length - 1].patientId;
    const idNumber = parseInt(lastPatientId.replace("PAT", ""), 10) + 1;
    return `PAT${idNumber.toString().padStart(3, "0")}`;
  };

  // Open the add patient modal with today's date preselected for the visitDate
  const openAddPatientModal = () => {
    setSelectedPatient({
      patientId: '',
      name: '',
      diagnosis: '',
      medications: [],
      visitDate: new Date().toISOString().slice(0, 10), // Set today's date
      phoneNumber: '',
      paymentMethod: '',
      totalAmount: '',
      doctor: '',
      nextAppointment: '',
      notes: ''
    });
    setIsEditMode(true); // Set to edit mode for adding new patient details
    setIsViewModalOpen(true);
  };

  // Handle adding a new patient
  const handleAddPatient = async (newPatientData: PatientFormData) => {
    const patientWithId: Patient = {
      ...newPatientData,
      patientId: generateNextPatientId(),
      doctor: "", // Default or fetched values as needed
      nextAppointment: "",
      notes: "",
    };

    try {
      const response = await axiosInstance.post("/add-patient", patientWithId);
      if (response.data?.patient) {
        setPatients((prevPatients) => [...prevPatients, response.data.patient]);
        setIsViewModalOpen(false);
      }
    } catch (error: any) {
      console.error("Error adding patient:", error?.response?.data?.message || error);
    }
  };

  // Handle saving updated patient details
  const handleSavePatient = async () => {
    if (selectedPatient) {
      try {
        const response = await axiosInstance.put(`/edit-patient/${selectedPatient.patientId}`, selectedPatient);
        if (response.data?.patient) {
          setPatients((prevPatients) =>
            prevPatients.map((p) =>
              p.patientId === selectedPatient.patientId ? response.data.patient : p
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

  // Handle deleting a patient
  const handleDeletePatient = async () => {
    if (selectedPatient) {
      try {
        await axiosInstance.delete(`/delete-patient/${selectedPatient.patientId}`);
        setPatients((prevPatients) => prevPatients.filter((p) => p.patientId !== selectedPatient.patientId));
        setIsViewModalOpen(false);
        setSelectedPatient(null);
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  // Handle adding/removing medications in edit mode
  const handleMedicationInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedPatient && e.currentTarget.value.trim()) {
      setSelectedPatient({
        ...selectedPatient,
        medications: [...selectedPatient.medications, e.currentTarget.value.trim()],
      });
      e.currentTarget.value = "";
    }
  };

  const handleRemoveMedication = (medication: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        medications: selectedPatient.medications.filter((med) => med !== medication),
      });
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <NavBar userInfo={userInfo} onLogout={onLogout} />
      {userInfo && <h1 className="text-2xl font-bold my-4">Greetings Dr. {userInfo.fullName}</h1>}

      {/* Patients Table */}
      <Table>
        <TableCaption>This Month's Patients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Medications</TableHead>
            <TableHead>Visit Date</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow
              key={patient.patientId}
              onClick={() => {
                setSelectedPatient(patient);
                setIsViewModalOpen(true);
                setIsEditMode(false);
              }}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{patient.patientId}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.diagnosis}</TableCell>
              <TableCell>{patient.medications.join(", ")}</TableCell>
              <TableCell>{new Date(patient.visitDate).toLocaleString()}</TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>{patient.paymentMethod}</TableCell>
              <TableCell>{patient.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Patient Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-black text-blue-300 hover:bg-blue-200 transition duration-300 fixed right-10 bottom-10"
        onClick={openAddPatientModal}
      >
        <MdAdd size={32} />
      </button>

      {/* View/Edit Modal */}
      {isViewModalOpen && selectedPatient && (
        <Modal
          isOpen={isViewModalOpen}
          onRequestClose={() => {
            setIsViewModalOpen(false);
            setSelectedPatient(null);
          }}
          style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
          className="w-[40%] bg-white rounded-md mx-auto mt-14 p-5 relative"
        >
          <button
            className="absolute top-3 right-3"
            onClick={() => {
              setIsViewModalOpen(false);
              setSelectedPatient(null);
            }}
          >
            <MdClose size={24} />
          </button>
          {isEditMode ? (
            <>
              <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
              <Label>Name</Label>
              <Input
                value={selectedPatient.name}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, name: e.target.value })
                }
              />
              <Label>Diagnosis</Label>
              <Input
                value={selectedPatient.diagnosis}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, diagnosis: e.target.value })
                }
              />
              <Label>Medications</Label>
              <Input
                placeholder="Enter medication and press Enter"
                onKeyDown={handleMedicationInput}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPatient.medications.map((medication, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center"
                  >
                    {medication}
                    <button
                      onClick={() => handleRemoveMedication(medication)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <Label>Visit Date</Label>
              <Input
                type="date"
                value={selectedPatient.visitDate}
                onChange={(e) =>
                  setSelectedPatient({ ...selectedPatient, visitDate: e.target.value })
                }
              />
              <Label>Phone Number</Label>
              <Input
                value={selectedPatient.phoneNumber}
                onChange={(e) =>
                  setSelectedPatient({
                    ...selectedPatient,
                    phoneNumber: e.target.value,
                  })
                }
              />
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
                <SelectTrigger>
                  <SelectValue />
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
                <strong>Visit Date:</strong> {new Date(selectedPatient.visitDate).toLocaleString()}
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
                  onClick={handleDeletePatient}
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
