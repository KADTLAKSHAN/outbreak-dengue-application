import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function DivisionManagement() {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDivision, setNewDivision] = useState({
    divisionName: "",
    districtId: null,
  });
  const [editDivision, setEditDivision] = useState({
    divisionId: null,
    divisionName: "",
    districtId: null,
  });
  const [districts, setDistricts] = useState([]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchDivisions();
    fetchDistricts();
  }, []);

  const fetchDivisions = async () => {
    try {
      const response = await axiosInstance.get("/api/public/division");
      setDivisions(response.data);
    } catch (error) {
      console.error("Error fetching divisions:", error);
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

  const handleDeleteDivision = async (divisionId) => {
    try {
      await axiosInstance.delete(`/api/admin/division/${divisionId}`);
      setDivisions(
        divisions.filter((division) => division.divisionId !== divisionId)
      );
      alert("Division deleted successfully!");
    } catch (error) {
      console.error("Error deleting division:", error);
      alert("Failed to delete division");
    }
  };

  const handleEditDivision = (division) => {
    setEditDivision({
      divisionId: division.divisionId,
      divisionName: division.divisionName,
      districtId: districts.find(
        (district) => district.value === division.districtId
      ),
    });
  };

  const handleUpdateDivision = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/api/admin/division/${editDivision.divisionId}`,
        { divisionName: editDivision.divisionName }
      );
      if (response.status === 200) {
        alert("Division updated successfully!");
        setEditDivision({
          divisionId: null,
          divisionName: "",
          districtId: null,
        });
        fetchDivisions(); // Refresh the division list
      }
    } catch (error) {
      console.error("Error updating division:", error);
      if (error.response && error.response.data) {
        alert(`Failed to update division: ${error.response.data.message}`);
      } else {
        alert("Failed to update division. Please try again.");
      }
    }
  };

  const handleRegisterDivision = async (e) => {
    e.preventDefault();

    // Ensure districtId is selected
    if (!newDivision.districtId) {
      alert("Please select a district.");
      return;
    }

    const divisionData = {
      divisionName: newDivision.divisionName,
      districtId: newDivision.districtId.value,
    };

    try {
      await axiosInstance.post("/api/admin/division", divisionData);
      alert("Division registered successfully!");

      // Reset the form
      setNewDivision({
        divisionName: "",
        districtId: null,
      });

      fetchDivisions(); // Refresh the division list
    } catch (error) {
      console.error("Error registering division:", error);
      if (error.response && error.response.data) {
        alert(`Failed to register division: ${error.response.data.message}`);
      } else {
        alert("Failed to register division. Please try again.");
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
      <h2 className="text-xl font-bold text-black">Division Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search divisions..."
        className="w-full p-2 border rounded-md text-black mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Division Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black w-1/6">Division ID</th>
              <th className="border p-3 text-black w-1/6">Division Name</th>
              <th className="border p-3 text-black w-1/6">District</th>
              <th className="border p-3 text-black w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {divisions
              .filter((division) =>
                division.divisionName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((division) => (
                <tr key={division.divisionId} className="border">
                  <td className="border p-3 text-black break-words">
                    {division.divisionId}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {division.divisionName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {districts.find(
                      (district) => district.value === division.districtId
                    )?.label || "N/A"}
                  </td>
                  <td className="border p-3 text-black break-words">
                    <button
                      onClick={() => handleDeleteDivision(division.divisionId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditDivision(division)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Register New Division */}
      <h3 className="text-lg font-bold text-black mt-6">
        Register New Division
      </h3>
      <form onSubmit={handleRegisterDivision} className="mt-4">
        <label className="block text-black font-semibold">Division Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newDivision.divisionName}
          onChange={(e) =>
            setNewDivision({ ...newDivision, divisionName: e.target.value })
          }
          required
        />

        <label className="block text-black font-semibold">District:</label>
        <Select
          options={districts}
          value={newDivision.districtId}
          onChange={(selected) =>
            setNewDivision({ ...newDivision, districtId: selected })
          }
          styles={customStyles} // Apply custom styles
        />

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Register Division
        </button>
      </form>

      {/* Edit Division Form */}
      {editDivision.divisionId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit Division</h3>
          <form onSubmit={handleUpdateDivision} className="mt-4">
            <label className="block text-black font-semibold">
              Division Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editDivision.divisionName}
              onChange={(e) =>
                setEditDivision({
                  ...editDivision,
                  divisionName: e.target.value,
                })
              }
              required
            />

            <label className="block text-black font-semibold">District:</label>
            <Select
              options={districts}
              value={editDivision.districtId}
              onChange={(selected) =>
                setEditDivision({ ...editDivision, districtId: selected })
              }
              styles={customStyles} // Apply custom styles
            />

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update Division
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DivisionManagement;
