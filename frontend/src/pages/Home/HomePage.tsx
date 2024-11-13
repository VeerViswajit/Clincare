import { AddPatient, NavBar } from '@/components'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MdAdd } from 'react-icons/md';

const patients = [
  {
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
  },
];

const HomePage = () => {
  return (
    <div>
      <NavBar/>
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
            <TableCell>
              {patient.medication.join(", ")}
            </TableCell>
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
    <AddPatient/>
    <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-blue-500 absolute right-10 bottom-10'  >
      <MdAdd className='text-[32px] text-blue-300'/></button>
      </div>
  )
}

export default HomePage