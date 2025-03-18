import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function MonthlyCaseDataManagement() {
  const [caseData, setCaseData] = useState([]);
  const [newCaseData, setNewCaseData] = useState({
    districtId: null,
    caseYear: new Date().getFullYear(), // Auto-set current year
    caseMonth: new Date().toLocaleString("default", { month: "long" }), // Auto-set current month
    noCases: "",
  });
  const [editCaseData, setEditCaseData] = useState({
    caseId: null,
    caseYear: "",
    caseMonth: "",
    noCases: "",
    districtId: null,
  });
  const [districts, setDistricts] = useState([]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchCaseData();
    fetchDistricts();
  }, []);

  const fetchCaseData = async () => {
    try {
      const response = await axiosInstance.get("/api/public/caseData/get");
      setCaseData(response.data);
    } catch (error) {
      console.error("Error fetching case data:", error);
      if (error.response && error.response.status === 400) {
        // alert(error.response.data.message);
      }
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await axiosInstance.get("/api/public/district");
      setDistricts(
        response.data.content.map((district) => ({
          value: district.districtId,
          label: district.districtName,
        }))
      );
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDeleteCaseData = async (caseId) => {
    try {
      await axiosInstance.delete(`/api/admin/caseData/${caseId}`);
      setCaseData(caseData.filter((caseItem) => caseItem.caseId !== caseId));
      alert("Case data deleted successfully!");
    } catch (error) {
      console.error("Error deleting case data:", error);
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert("Failed to delete case data");
      }
    }
  };

  const handleEditCaseData = (caseItem) => {
    setEditCaseData({
      caseId: caseItem.caseId,
      caseYear: caseItem.caseYear,
      caseMonth: caseItem.caseMonth, // Auto-set month from existing data
      noCases: caseItem.noCases,
      districtId: districts.find(
        (district) => district.label === caseItem.districtName
      ), // Auto-set district
    });
  };

  const handleUpdateCaseData = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/api/admin/caseData/${editCaseData.caseId}`,
        {
          caseYear: editCaseData.caseYear,
          caseMonth: editCaseData.caseMonth, // Use the auto-set month
          noCases: editCaseData.noCases,
          districtName: editCaseData.districtId.label, // Extract district name
        }
      );
      if (response.status === 200) {
        alert("Case data updated successfully!");
        setEditCaseData({
          caseId: null,
          caseYear: "",
          caseMonth: "",
          noCases: "",
          districtId: null,
        });
        fetchCaseData(); // Refresh the case data list
      }
    } catch (error) {
      console.error("Error updating case data:", error);
      if (error.response && error.response.data) {
        alert(`Failed to update case data: ${error.response.data.message}`);
      } else {
        alert("Failed to update case data. Please try again.");
      }
    }
  };

  const handleRegisterCaseData = async (e) => {
    e.preventDefault();

    // Ensure districtId is selected
    if (!newCaseData.districtId) {
      alert("Please select a district.");
      return;
    }

    const caseDataPayload = {
      caseYear: newCaseData.caseYear,
      caseMonth: newCaseData.caseMonth, // Use the auto-set month
      noCases: newCaseData.noCases,
    };

    try {
      await axiosInstance.post(
        `/api/public/caseData/${newCaseData.districtId.value}`,
        caseDataPayload
      );
      alert("Case data registered successfully!");

      // Reset the form (except for auto-set year and month)
      setNewCaseData({
        districtId: null,
        caseYear: new Date().getFullYear(), // Reset to current year
        caseMonth: new Date().toLocaleString("default", { month: "long" }), // Reset to current month
        noCases: "",
      });

      fetchCaseData(); // Refresh the case data list
    } catch (error) {
      console.error("Error registering case data:", error);
      if (error.response && error.response.data) {
        alert(`Failed to register case data: ${error.response.data.message}`);
      } else {
        alert("Failed to register case data. Please try again.");
      }
    }
  };

  // Custom styles for react-select to ensure black text
  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: "black", // Ensure text color is black
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black", // Ensure selected value text is black
    }),
    option: (provided) => ({
      ...provided,
      color: "black", // Ensure dropdown options text is black
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-black">
        Monthly Case Data Management
      </h2>

      {/* Case Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black w-1/6">Case ID</th>
              <th className="border p-3 text-black w-1/6">District</th>
              <th className="border p-3 text-black w-1/6">Year</th>
              <th className="border p-3 text-black w-1/6">Month</th>
              <th className="border p-3 text-black w-1/6">No. of Cases</th>
              <th className="border p-3 text-black w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {caseData.map((caseItem) => (
              <tr key={caseItem.caseId} className="border">
                <td className="border p-3 text-black break-words">
                  {caseItem.caseId}
                </td>
                <td className="border p-3 text-black break-words">
                  {caseItem.districtName}
                </td>
                <td className="border p-3 text-black break-words">
                  {caseItem.caseYear}
                </td>
                <td className="border p-3 text-black break-words">
                  {caseItem.caseMonth}
                </td>
                <td className="border p-3 text-black break-words">
                  {caseItem.noCases}
                </td>
                <td className="border p-3 text-black break-words">
                  <button
                    onClick={() => handleDeleteCaseData(caseItem.caseId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mb-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditCaseData(caseItem)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register New Case Data */}
      <h3 className="text-lg font-bold text-black mt-6">
        Register New Case Data
      </h3>
      <form onSubmit={handleRegisterCaseData} className="mt-4">
        <label className="block text-black font-semibold">District:</label>
        <Select
          options={districts}
          value={newCaseData.districtId}
          onChange={(selected) =>
            setNewCaseData({ ...newCaseData, districtId: selected })
          }
          styles={customStyles} // Apply custom styles
        />

        <label className="block text-black font-semibold">Year:</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md text-black"
          value={newCaseData.caseYear}
          onChange={(e) =>
            setNewCaseData({ ...newCaseData, caseYear: e.target.value })
          }
          required
        />

        <label className="block text-black font-semibold">Month:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black bg-gray-100"
          value={newCaseData.caseMonth}
          readOnly // Make the month field read-only
        />

        <label className="block text-black font-semibold">No. of Cases:</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md text-black"
          value={newCaseData.noCases}
          onChange={(e) =>
            setNewCaseData({ ...newCaseData, noCases: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Register Case Data
        </button>
      </form>

      {/* Edit Case Data Form */}
      {editCaseData.caseId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit Case Data</h3>
          <form onSubmit={handleUpdateCaseData} className="mt-4">
            <label className="block text-black font-semibold">District:</label>
            <Select
              options={districts}
              value={editCaseData.districtId}
              onChange={(selected) =>
                setEditCaseData({ ...editCaseData, districtId: selected })
              }
              styles={customStyles} // Apply custom styles
            />

            <label className="block text-black font-semibold">Year:</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md text-black"
              value={editCaseData.caseYear}
              onChange={(e) =>
                setEditCaseData({ ...editCaseData, caseYear: e.target.value })
              }
              required
            />

            <label className="block text-black font-semibold">Month:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black bg-gray-100"
              value={editCaseData.caseMonth}
              readOnly // Make the month field read-only
            />

            <label className="block text-black font-semibold">
              No. of Cases:
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-md text-black"
              value={editCaseData.noCases}
              onChange={(e) =>
                setEditCaseData({ ...editCaseData, noCases: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update Case Data
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MonthlyCaseDataManagement;
