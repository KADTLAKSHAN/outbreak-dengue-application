import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

function ComplaintPanel() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newComplaint, setNewComplaint] = useState({
    complaintType: "",
    complaintDetails: "",
  });

  const complaintTypes = [
    "Symptoms Reporting",
    "Mosquito Breeding Sites",
    "Public Health Concerns",
    "Awareness Issues",
    "Medical Facility Issues",
    "Environmental Health Concerns",
    "Community Engagement",
    "Technical Issue",
  ].map((type) => ({ value: type, label: type }));

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get("/api/public/complaints/user");
        setComplaints(response.data.content);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);

  const columns = [
    { accessorKey: "complaintType", header: "Type" },
    { accessorKey: "complaintDetails", header: "Details" },
    { accessorKey: "complaintDate", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
            row.original.status ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.original.status ? "Replied" : "Pending"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedComplaint(row.original)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-md"
        >
          View Feedback
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: complaints,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/api/public/complaints",
        newComplaint
      );

      // Add new complaint to the table without refreshing
      setComplaints((prev) => [...prev, response.data]);

      alert("Complaint submitted successfully");

      // Reset form
      setNewComplaint({ complaintType: "", complaintDetails: "" });
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black mb-4">
        Complaint Management
      </h2>

      {/* Table */}
      <table className="w-full border-collapse overflow-x-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border p-3 bg-gray-200 text-black"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-3 border text-black whitespace-normal break-words max-w-xs"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Feedback Section */}
      {selectedComplaint && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-bold text-black">Complaint Feedback</h3>
          <p className="text-black">
            {selectedComplaint.complaintReply || "No feedback yet"}
          </p>
        </div>
      )}

      {/* Submit Complaint Section */}
      <h3 className="text-lg font-bold text-black mt-6">Submit a Complaint</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block text-black font-semibold">
          Complaint Type:
        </label>
        <Select
          options={complaintTypes}
          value={complaintTypes.find(
            (type) => type.value === newComplaint.complaintType
          )}
          onChange={(option) =>
            setNewComplaint({ ...newComplaint, complaintType: option.value })
          }
          placeholder="-- Select Complaint Type --"
          className="mb-4 text-black"
        />

        <label className="block text-black font-semibold">
          Complaint Details:
        </label>
        <textarea
          name="complaintDetails"
          value={newComplaint.complaintDetails}
          onChange={(e) =>
            setNewComplaint({
              ...newComplaint,
              complaintDetails: e.target.value,
            })
          }
          className="w-full p-2 border rounded-md text-black"
          rows="4"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default ComplaintPanel;
