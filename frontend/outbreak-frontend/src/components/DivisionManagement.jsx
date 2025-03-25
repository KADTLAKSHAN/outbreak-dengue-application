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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchDivisions();
    fetchDistricts();
  }, [currentPage, pageSize, searchTerm]);

  const fetchDivisions = async () => {
    try {
      const response = await axiosInstance.get("/api/public/division/table", {
        params: {
          pageNumber: currentPage,
          pageSize: pageSize,
          search: searchTerm,
        },
      });
      setDivisions(response.data.content);
      setTotalPages(response.data.totalpages);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (error) {
      console.error("Error fetching divisions:", error);
      setError("Failed to fetch divisions. Please try again.");
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
      setError("Failed to fetch districts. Please try again.");
    }
  };

  const handleDeleteDivision = async (divisionId) => {
    try {
      await axiosInstance.delete(`/api/admin/division/${divisionId}`);
      alert("Division deleted successfully!");
      fetchDivisions();
    } catch (error) {
      console.error("Error deleting division:", error);
      setError("Failed to delete division. Please try again.");
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
        {
          divisionName: editDivision.divisionName,
          districtId: editDivision.districtId.value,
        }
      );
      if (response.status === 200) {
        alert("Division updated successfully!");
        setEditDivision({
          divisionId: null,
          divisionName: "",
          districtId: null,
        });
        fetchDivisions();
      }
    } catch (error) {
      console.error("Error updating division:", error);
      setError("Failed to update division. Please try again.");
    }
  };

  const handleRegisterDivision = async (e) => {
    e.preventDefault();
    if (!newDivision.districtId) {
      alert("Please select a district.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/admin/division", {
        divisionName: newDivision.divisionName,
        districtId: newDivision.districtId.value,
      });
      if (response.status === 201) {
        alert("Division added successfully!");
        setNewDivision({
          divisionName: "",
          districtId: null,
        });
        fetchDivisions();
      }
    } catch (error) {
      console.error("Error adding division:", error);
      setError("Failed to add division. Please try again.");
    }
  };

  const handlePageChange = (selectedOption) => {
    setCurrentPage(selectedOption.value);
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
    setCurrentPage(0);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      color: "black",
      backgroundColor: "white",
      borderColor: "#d1d5db",
      "&:hover": {
        borderColor: "#9ca3af",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      marginTop: "0",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "black",
      backgroundColor: state.isSelected ? "#e5e7eb" : "white",
      "&:hover": {
        backgroundColor: "#f3f4f6",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  const pageOptions = Array.from({ length: totalPages }, (_, i) => ({
    value: i,
    label: `Page ${i + 1}`,
  }));

  const pageSizeOptions = [
    { value: 10, label: "10" },
    { value: 25, label: "25" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-black mb-4">Division Management</h2>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search divisions..."
          className="w-full p-2 border rounded-l-md text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            setCurrentPage(0);
            fetchDivisions();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
        >
          Search
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Division Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black">ID</th>
              <th className="border p-3 text-black">Division Name</th>
              <th className="border p-3 text-black">District</th>
              <th className="border p-3 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {divisions.map((division) => (
              <tr key={division.divisionId} className="border hover:bg-gray-50">
                <td className="border p-3 text-black">{division.divisionId}</td>
                <td className="border p-3 text-black">
                  {division.divisionName}
                </td>
                <td className="border p-3 text-black">
                  {districts.find((d) => d.value === division.districtId)
                    ?.label || "N/A"}
                </td>
                <td className="border p-3 text-black">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditDivision(division)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDivision(division.divisionId)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-black">Show:</span>
          <Select
            options={pageSizeOptions}
            value={pageSizeOptions.find((option) => option.value === pageSize)}
            onChange={handlePageSizeChange}
            styles={customStyles}
            className="w-24"
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
          <span className="text-black">of {totalElements} records</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange({ value: currentPage - 1 })}
            disabled={currentPage === 0}
            className={`px-3 py-1 rounded-md ${
              currentPage === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>
          <Select
            options={pageOptions}
            value={pageOptions.find((option) => option.value === currentPage)}
            onChange={handlePageChange}
            styles={customStyles}
            className="w-32"
            menuPortalTarget={document.body}
            menuPosition="fixed"
          />
          <button
            onClick={() => handlePageChange({ value: currentPage + 1 })}
            disabled={currentPage >= totalPages - 1}
            className={`px-3 py-1 rounded-md ${
              currentPage >= totalPages - 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add New Division */}
      <h3 className="text-lg font-bold text-black mt-6">Add New Division</h3>
      <form onSubmit={handleRegisterDivision} className="mt-4">
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">
            Division Name:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-md text-black"
            value={newDivision.divisionName}
            onChange={(e) =>
              setNewDivision({ ...newDivision, divisionName: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-black font-semibold mb-2">
            District:
          </label>
          <Select
            options={districts}
            value={newDivision.districtId}
            onChange={(selected) =>
              setNewDivision({ ...newDivision, districtId: selected })
            }
            styles={customStyles}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            placeholder="Select a district..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Add Division
        </button>
      </form>

      {/* Edit Division Form */}
      {editDivision.divisionId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit Division</h3>
          <form onSubmit={handleUpdateDivision} className="mt-4">
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
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
            </div>
            <div className="mb-4">
              <label className="block text-black font-semibold mb-2">
                District:
              </label>
              <Select
                options={districts}
                value={editDivision.districtId}
                onChange={(selected) =>
                  setEditDivision({ ...editDivision, districtId: selected })
                }
                styles={customStyles}
                menuPortalTarget={document.body}
                menuPosition="fixed"
                placeholder="Select a district..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
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
