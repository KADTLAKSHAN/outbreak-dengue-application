import { useState, useEffect } from "react";
import axios from "axios";

function DistrictManagement() {
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDistrict, setNewDistrict] = useState({
    districtName: "",
  });
  const [editDistrict, setEditDistrict] = useState({
    districtId: null,
    districtName: "",
  });

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axiosInstance.get("/api/public/district");
      setDistricts(response.data.content);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDeleteDistrict = async (districtId) => {
    try {
      await axiosInstance.delete(`/api/admin/district/${districtId}`);
      setDistricts(
        districts.filter((district) => district.districtId !== districtId)
      );
      alert("District deleted successfully!");
    } catch (error) {
      console.error("Error deleting district:", error);
      alert("Failed to delete district");
    }
  };

  const handleEditDistrict = (district) => {
    setEditDistrict({
      districtId: district.districtId,
      districtName: district.districtName,
    });
  };

  const handleUpdateDistrict = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/api/admin/district/${editDistrict.districtId}`,
        { districtName: editDistrict.districtName }
      );
      if (response.status === 200) {
        alert("District updated successfully!");
        setEditDistrict({
          districtId: null,
          districtName: "",
        });
        fetchDistricts(); // Refresh the district list
      }
    } catch (error) {
      console.error("Error updating district:", error);
      if (error.response && error.response.data) {
        alert(`Failed to update district: ${error.response.data.message}`);
      } else {
        alert("Failed to update district. Please try again.");
      }
    }
  };

  const handleRegisterDistrict = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/api/admin/district", {
        districtName: newDistrict.districtName,
      });
      alert("District registered successfully!");

      // Reset the form
      setNewDistrict({
        districtName: "",
      });

      fetchDistricts(); // Refresh the district list
    } catch (error) {
      console.error("Error registering district:", error);
      if (error.response && error.response.data) {
        alert(`Failed to register district: ${error.response.data.message}`);
      } else {
        alert("Failed to register district. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-black">District Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search districts..."
        className="w-full p-2 border rounded-md text-black mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* District Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black w-1/6">District ID</th>
              <th className="border p-3 text-black w-1/6">District Name</th>
              <th className="border p-3 text-black w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {districts
              .filter((district) =>
                district.districtName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((district) => (
                <tr key={district.districtId} className="border">
                  <td className="border p-3 text-black break-words">
                    {district.districtId}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {district.districtName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    <button
                      onClick={() => handleDeleteDistrict(district.districtId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md ml-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditDistrict(district)}
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

      {/* Register New District */}
      <h3 className="text-lg font-bold text-black mt-6">
        Register New District
      </h3>
      <form onSubmit={handleRegisterDistrict} className="mt-4">
        <label className="block text-black font-semibold">District Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newDistrict.districtName}
          onChange={(e) =>
            setNewDistrict({ ...newDistrict, districtName: e.target.value })
          }
          required
        />

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Register District
        </button>
      </form>

      {/* Edit District Form */}
      {editDistrict.districtId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit District</h3>
          <form onSubmit={handleUpdateDistrict} className="mt-4">
            <label className="block text-black font-semibold">
              District Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editDistrict.districtName}
              onChange={(e) =>
                setEditDistrict({
                  ...editDistrict,
                  districtName: e.target.value,
                })
              }
              required
            />

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update District
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DistrictManagement;
