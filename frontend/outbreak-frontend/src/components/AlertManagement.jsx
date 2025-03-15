import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function AlertManagement() {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    alertType: "",
    alertDescription: "",
    districtId: null,
  });
  const [editAlert, setEditAlert] = useState({
    alertId: null,
    alertType: "",
    alertDescription: "",
    districtId: null,
  });
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null); // For filtering alerts by district

  // Predefined alert types
  const alertTypes = [
    { value: "Low Risk", label: "Low Risk" },
    { value: "Moderate Risk", label: "Moderate Risk" },
    { value: "High Risk", label: "High Risk" },
    { value: "Outbreak Alert", label: "Outbreak Alert" },
    { value: "Critical Alert", label: "Critical Alert" },
    { value: "Local Outbreak", label: "Local Outbreak" },
    { value: "Nearby Outbreaks", label: "Nearby Outbreaks" },
    { value: "Travel Alert", label: "Travel Alert" },
    {
      value: "Public Health Announcements",
      label: "Public Health Announcements",
    },
  ];

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchAlerts();
    fetchDistricts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axiosInstance.get("/api/public/alerts");
      setAlerts(response.data.content);
    } catch (error) {
      console.error("Error fetching alerts:", error);
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

  const handleDeleteAlert = async (alertId) => {
    try {
      await axiosInstance.delete(`/api/admin/alerts/${alertId}`);
      setAlerts(alerts.filter((alert) => alert.alertId !== alertId));
      alert("Alert deleted successfully!");
    } catch (error) {
      console.error("Error deleting alert:", error);
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert("Failed to delete alert");
      }
    }
  };

  const handleEditAlert = (alert) => {
    setEditAlert({
      alertId: alert.alertId,
      alertType: alertTypes.find((type) => type.value === alert.alertType),
      alertDescription: alert.alertDescription,
      districtId: districts.find(
        (district) => district.value === alert.districtId
      ),
    });
  };

  const handleUpdateAlert = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(
        `/api/admin/alert/${editAlert.alertId}`,
        {
          alertType: editAlert.alertType.value,
          alertDescription: editAlert.alertDescription,
          districtId: editAlert.districtId.value,
        }
      );
      if (response.status === 200) {
        alert("Alert updated successfully!");
        setEditAlert({
          alertId: null,
          alertType: "",
          alertDescription: "",
          districtId: null,
        });
        fetchAlerts(); // Refresh the alert list
      }
    } catch (error) {
      console.error("Error updating alert:", error);
      if (error.response && error.response.data) {
        alert(`Failed to update alert: ${error.response.data.message}`);
      } else {
        alert("Failed to update alert. Please try again.");
      }
    }
  };

  const handleRegisterAlert = async (e) => {
    e.preventDefault();

    // Ensure districtId is selected
    if (!newAlert.districtId) {
      alert("Please select a district.");
      return;
    }

    // Ensure alertType is selected
    if (!newAlert.alertType) {
      alert("Please select an alert type.");
      return;
    }

    const alertData = {
      alertType: newAlert.alertType.value,
      alertDescription: newAlert.alertDescription,
    };

    try {
      await axiosInstance.post(
        `/api/public/alerts/${newAlert.districtId.value}`,
        alertData
      );
      alert("Alert registered successfully!");

      // Reset the form
      setNewAlert({
        alertType: "",
        alertDescription: "",
        districtId: null,
      });

      fetchAlerts(); // Refresh the alert list
    } catch (error) {
      console.error("Error registering alert:", error);
      if (error.response && error.response.data) {
        alert(`Failed to register alert: ${error.response.data.message}`);
      } else {
        alert("Failed to register alert. Please try again.");
      }
    }
  };

  // Filter alerts by selected district
  const filteredAlerts = selectedDistrict
    ? alerts.filter((alert) => alert.districtId === selectedDistrict.value)
    : alerts;

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
      <h2 className="text-xl font-bold text-black">Alert Management</h2>

      {/* Filter by District */}
      <div className="mt-4">
        <label className="block text-black font-semibold">
          Filter by District:
        </label>
        <Select
          options={districts}
          value={selectedDistrict}
          onChange={(selected) => setSelectedDistrict(selected)}
          styles={customStyles} // Apply custom styles
          isClearable
          placeholder="Select a district..."
        />
      </div>

      {/* Alert Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black w-1/6">Alert ID</th>
              <th className="border p-3 text-black w-1/6">Alert Type</th>
              <th className="border p-3 text-black w-1/6">Description</th>
              <th className="border p-3 text-black w-1/6">District</th>
              <th className="border p-3 text-black w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.alertId} className="border">
                <td className="border p-3 text-black break-words">
                  {alert.alertId}
                </td>
                <td className="border p-3 text-black break-words">
                  {alert.alertType}
                </td>
                <td className="border p-3 text-black break-words">
                  {alert.alertDescription}
                </td>
                <td className="border p-3 text-black break-words">
                  {alert.districtName}
                </td>
                <td className="border p-3 text-black break-words">
                  <button
                    onClick={() => handleDeleteAlert(alert.alertId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mb-4"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditAlert(alert)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md ml-2"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register New Alert */}
      <h3 className="text-lg font-bold text-black mt-6">Register New Alert</h3>
      <form onSubmit={handleRegisterAlert} className="mt-4">
        <label className="block text-black font-semibold">Alert Type:</label>
        <Select
          options={alertTypes}
          value={newAlert.alertType}
          onChange={(selected) =>
            setNewAlert({ ...newAlert, alertType: selected })
          }
          styles={customStyles} // Apply custom styles
        />

        <label className="block text-black font-semibold">Description:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newAlert.alertDescription}
          onChange={(e) =>
            setNewAlert({ ...newAlert, alertDescription: e.target.value })
          }
          required
        />

        <label className="block text-black font-semibold">District:</label>
        <Select
          options={districts}
          value={newAlert.districtId}
          onChange={(selected) =>
            setNewAlert({ ...newAlert, districtId: selected })
          }
          styles={customStyles} // Apply custom styles
        />

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Register Alert
        </button>
      </form>

      {/* Edit Alert Form */}
      {editAlert.alertId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit Alert</h3>
          <form onSubmit={handleUpdateAlert} className="mt-4">
            <label className="block text-black font-semibold">
              Alert Type:
            </label>
            <Select
              options={alertTypes}
              value={editAlert.alertType}
              onChange={(selected) =>
                setEditAlert({ ...editAlert, alertType: selected })
              }
              styles={customStyles} // Apply custom styles
            />

            <label className="block text-black font-semibold">
              Description:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editAlert.alertDescription}
              onChange={(e) =>
                setEditAlert({ ...editAlert, alertDescription: e.target.value })
              }
              required
            />

            <label className="block text-black font-semibold">District:</label>
            <Select
              options={districts}
              value={editAlert.districtId}
              onChange={(selected) =>
                setEditAlert({ ...editAlert, districtId: selected })
              }
              styles={customStyles} // Apply custom styles
            />

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update Alert
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AlertManagement;
