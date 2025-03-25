import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { FaSearch, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

function DatasetManagement() {
  const [datasets, setDatasets] = useState([]);
  const [newDataset, setNewDataset] = useState({
    numberOfCases: "",
    caseMonth: "",
    caseYear: "",
    caseWeek: "",
    districtId: null,
  });
  const [editDataset, setEditDataset] = useState({
    graphDataId: null,
    numberOfCases: "",
    caseMonth: "",
    caseYear: "",
    caseWeek: "",
    districtId: null,
  });
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchDatasets();
    fetchDistricts();
  }, [currentPage, pageSize, searchTerm]);

  const fetchDatasets = async () => {
    try {
      let url = "/api/public/dataset";
      if (searchTerm) {
        url = `/api/public/dataset/district/${searchTerm}`;
      }
      const response = await axiosInstance.get(url, {
        params: {
          pageNumber: currentPage,
          pageSize: pageSize,
          sortBy: "graphDataId",
          sortOrder: "desc",
        },
      });
      setDatasets(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDatasets([]);
        setError("No data found with the specified criteria.");
      } else {
        setError("Failed to fetch datasets. Please try again.");
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
      setError("Failed to fetch districts. Please try again.");
    }
  };

  const handleDeleteDataset = async (graphDataId) => {
    try {
      await axiosInstance.delete(`/api/admin/dataset/${graphDataId}`);
      alert("Dataset deleted successfully!");
      fetchDatasets();
    } catch (error) {
      console.error("Error deleting dataset:", error);
      setError("Failed to delete dataset. Please try again.");
    }
  };

  const handleEditDataset = (dataset) => {
    setEditDataset({
      graphDataId: dataset.graphDataId,
      numberOfCases: dataset.numberOfCases,
      caseMonth: dataset.caseMonth,
      caseYear: dataset.caseYear,
      caseWeek: dataset.caseWeek,
      districtId: districts.find((d) => d.value === dataset.districtId),
    });
  };

  const handleUpdateDataset = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/api/admin/dataset/${editDataset.graphDataId}`,
        {
          numberOfCases: editDataset.numberOfCases,
          caseMonth: editDataset.caseMonth,
          caseYear: editDataset.caseYear,
          caseWeek: editDataset.caseWeek,
          districtId: editDataset.districtId.value,
        }
      );
      if (response.status === 200) {
        alert("Dataset updated successfully!");
        setEditDataset({
          graphDataId: null,
          numberOfCases: "",
          caseMonth: "",
          caseYear: "",
          caseWeek: "",
          districtId: null,
        });
        fetchDatasets();
      }
    } catch (error) {
      console.error("Error updating dataset:", error);
      setError("Failed to update dataset. Please try again.");
    }
  };

  const handleRegisterDataset = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/admin/dataset", {
        numberOfCases: newDataset.numberOfCases,
        caseMonth: newDataset.caseMonth,
        caseYear: newDataset.caseYear,
        caseWeek: newDataset.caseWeek,
        districtId: newDataset.districtId.value,
      });
      if (response.status === 201) {
        alert("Dataset added successfully!");
        setNewDataset({
          numberOfCases: "",
          caseMonth: "",
          caseYear: "",
          caseWeek: "",
          districtId: null,
        });
        fetchDatasets();
      }
    } catch (error) {
      console.error("Error adding dataset:", error);
      setError("Failed to add dataset. Please try again.");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
    pagination: (provided) => ({
      ...provided,
      color: "black",
      minWidth: "200px",
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto relative">
      <h2 className="text-xl font-bold text-black mb-4">Dataset Management</h2>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search by district..."
          className="w-full p-2 border rounded-l-md text-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* <button
          onClick={() => {
            setCurrentPage(0);
            fetchDatasets();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md"
        ></button> */}
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Dataset Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black">ID</th>
              <th className="border p-3 text-black">Cases</th>
              <th className="border p-3 text-black">Month</th>
              <th className="border p-3 text-black">Year</th>
              <th className="border p-3 text-black">Week</th>
              <th className="border p-3 text-black">District</th>
              <th className="border p-3 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.graphDataId} className="border hover:bg-gray-50">
                <td className="border p-3 text-black">{dataset.graphDataId}</td>
                <td className="border p-3 text-black">
                  {dataset.numberOfCases}
                </td>
                <td className="border p-3 text-black">{dataset.caseMonth}</td>
                <td className="border p-3 text-black">{dataset.caseYear}</td>
                <td className="border p-3 text-black">{dataset.caseWeek}</td>
                <td className="border p-3 text-black">
                  {districts.find((d) => d.value === dataset.districtId)
                    ?.label || "N/A"}
                </td>
                <td className="border p-3 text-black">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditDataset(dataset)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDataset(dataset.graphDataId)}
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
        <div className="flex items-center">
          <span className="mr-2">Show:</span>
          <Select
            options={[
              { value: 10, label: "10" },
              { value: 25, label: "25" },
              { value: 50, label: "50" },
              { value: 100, label: "100" },
            ]}
            value={{ value: pageSize, label: pageSize.toString() }}
            onChange={(selected) => {
              setPageSize(selected.value);
              setCurrentPage(0);
            }}
            styles={customStyles}
            className="w-20"
          />
          <span className="ml-2">of {totalElements} records</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
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
            options={Array.from({ length: totalPages }, (_, i) => ({
              value: i,
              label: `Page ${i + 1}`,
            }))}
            value={{ value: currentPage, label: `Page ${currentPage + 1}` }}
            onChange={(selected) => handlePageChange(selected.value)}
            styles={customStyles}
            className="w-32"
          />
          <button
            onClick={() => handlePageChange(currentPage + 1)}
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

      {/* Add New Dataset */}
      <h3 className="text-lg font-bold text-black mt-6">Add New Dataset</h3>
      <form
        onSubmit={handleRegisterDataset}
        className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-black font-semibold">
            Number of Cases:
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded-md text-black"
            value={newDataset.numberOfCases}
            onChange={(e) =>
              setNewDataset({ ...newDataset, numberOfCases: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Month:</label>
          <input
            type="number"
            min="1"
            max="12"
            className="w-full p-2 border rounded-md text-black"
            value={newDataset.caseMonth}
            onChange={(e) =>
              setNewDataset({ ...newDataset, caseMonth: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Year:</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md text-black"
            value={newDataset.caseYear}
            onChange={(e) =>
              setNewDataset({ ...newDataset, caseYear: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-black font-semibold">Week:</label>
          <input
            type="number"
            min="1"
            max="52"
            className="w-full p-2 border rounded-md text-black"
            value={newDataset.caseWeek}
            onChange={(e) =>
              setNewDataset({ ...newDataset, caseWeek: e.target.value })
            }
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-black font-semibold">District:</label>
          <Select
            options={districts}
            value={newDataset.districtId}
            onChange={(selected) =>
              setNewDataset({ ...newDataset, districtId: selected })
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
          className="md:col-span-2 mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          <FaPlus className="inline mr-2" /> Add Dataset
        </button>
      </form>

      {/* Edit Dataset Form */}
      {editDataset.graphDataId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit Dataset</h3>
          <form
            onSubmit={handleUpdateDataset}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-black font-semibold">
                Number of Cases:
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md text-black"
                value={editDataset.numberOfCases}
                onChange={(e) =>
                  setEditDataset({
                    ...editDataset,
                    numberOfCases: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <label className="block text-black font-semibold">Month:</label>
              <input
                type="number"
                min="1"
                max="12"
                className="w-full p-2 border rounded-md text-black"
                value={editDataset.caseMonth}
                onChange={(e) =>
                  setEditDataset({ ...editDataset, caseMonth: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-black font-semibold">Year:</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md text-black"
                value={editDataset.caseYear}
                onChange={(e) =>
                  setEditDataset({ ...editDataset, caseYear: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-black font-semibold">Week:</label>
              <input
                type="number"
                min="1"
                max="52"
                className="w-full p-2 border rounded-md text-black"
                value={editDataset.caseWeek}
                onChange={(e) =>
                  setEditDataset({ ...editDataset, caseWeek: e.target.value })
                }
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-black font-semibold">
                District:
              </label>
              <Select
                options={districts}
                value={editDataset.districtId}
                onChange={(selected) =>
                  setEditDataset({ ...editDataset, districtId: selected })
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
              className="md:col-span-2 mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update Dataset
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DatasetManagement;
