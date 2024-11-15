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
import { MdAdd, MdClose } from 'react-icons/md';
import Modal from 'react-modal';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const patients = [{
  patientId: "PAT001",
  name: "John Doe",
  diagnosis: "Hypertension",
  medication: ["Lisinopril 10mg", "Amlodipine 5mg"],
  visitDate: "12-09-2023",
  paymentStatus: "Paid",
  totalAmount: "$250.00",
  paymentMethod: "Credit Card",
  doctor: "Dr. Smith",
  nextAppointment: "12-10-2023",
  notes: "Blood pressure under control, continue medication.",
},
// Additional patient data...
{
  patientId: "PAT002",
  name: "Jane Smith",
  diagnosis: "Diabetes Type 2",
  medication: ["Metformin 500mg", "Insulin Glargine"],
  visitDate: "10-09-2023",
  paymentStatus: "Pending",
  totalAmount: "$150.00",
  paymentMethod: "PayPal",
  doctor: "Dr. Jones",
  nextAppointment: "10-10-2023",
  notes: "Diet modification recommended.",
},
{
  patientId: "PAT003",
  name: "Michael Brown",
  diagnosis: "Asthma",
  medication: ["Albuterol Inhaler", "Montelukast 10mg"],
  visitDate: "08-09-2023",
  paymentStatus: "Unpaid",
  totalAmount: "$350.00",
  paymentMethod: "Bank Transfer",
  doctor: "Dr. White",
  nextAppointment: "08-10-2023",
  notes: "Frequent attacks reported, adjust dosage.",
},
{
  patientId: "PAT004",
  name: "Sarah Wilson",
  diagnosis: "Seasonal Allergies",
  medication: ["Cetirizine 10mg", "Fluticasone Nasal Spray"],
  visitDate: "05-09-2023",
  paymentStatus: "Paid",
  totalAmount: "$450.00",
  paymentMethod: "Credit Card",
  doctor: "Dr. Black",
  nextAppointment: "05-10-2023",
  notes: "Symptoms improving, continue current treatment.",
},
{
  patientId: "PAT005",
  name: "Emily Davis",
  diagnosis: "Chronic Back Pain",
  medication: ["Ibuprofen 400mg", "Cyclobenzaprine 5mg"],
  visitDate: "03-09-2023",
  paymentStatus: "Paid",
  totalAmount: "$550.00",
  paymentMethod: "PayPal",
  doctor: "Dr. Green",
  nextAppointment: "03-10-2023",
  notes: "Recommend physical therapy.",
},
{
  patientId: "PAT006",
  name: "Christopher Lee",
  diagnosis: "Arthritis",
  medication: ["Naproxen 500mg", "Glucosamine"],
  visitDate: "01-09-2023",
  paymentStatus: "Pending",
  totalAmount: "$200.00",
  paymentMethod: "Bank Transfer",
  doctor: "Dr. Blue",
  nextAppointment: "01-10-2023",
  notes: "Pain management plan discussed.",
},
{
  patientId: "PAT007",
  name: "Sophia Taylor",
  diagnosis: "High Cholesterol",
  medication: ["Atorvastatin 20mg", "Omega-3 Supplement"],
  visitDate: "25-08-2023",
  paymentStatus: "Unpaid",
  totalAmount: "$300.00",
  paymentMethod: "Credit Card",
  doctor: "Dr. Gray",
  nextAppointment: "25-09-2023",
  notes: "Lifestyle changes recommended.",
}];

const HomePage = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  // Fetch user info on component mount if logged in
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };
  useEffect(() => {
    getUserInfo();
    return ()=>{};
  }, []);

  // Handle logout
  const onLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate("/");
  };
  
  

  return (
    <div>
      <NavBar userInfo={userInfo} onLogout={onLogout} />
      <Table>
        <TableCaption>This Month's Patients</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Patient ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Medication</TableHead>
            <TableHead>Visit Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.patientId}>
              <TableCell className="font-medium">{patient.patientId}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.diagnosis}</TableCell>
              <TableCell>{patient.medication.join(", ")}</TableCell>
              <TableCell>{patient.visitDate}</TableCell>
              <TableCell>{patient.paymentStatus}</TableCell>
              <TableCell>{patient.paymentMethod}</TableCell>
              <TableCell className="text-right">{patient.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-500 absolute right-10 bottom-10"
        onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className="text-[32px] text-blue-300" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll relative"
      >
        <button
          className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
          onClick={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        >
          <MdClose size={24} />
        </button>
        <AddPatient />
      </Modal>
    </div>
  );
};

export default HomePage;
