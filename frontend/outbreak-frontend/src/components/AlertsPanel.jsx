import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function AlertsPanel({ user }) {
  const [districts, setDistricts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [newAlert, setNewAlert] = useState({
    alertType: "",
    alertDescription: "",
  });
  const [error, setError] = useState(null);
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  // Alert types for selection
  const alertTypes = [
    "Low Risk",
    "Moderate Risk",
    "High Risk",
    "Outbreak Alert",
    "Critical Alert",
    "Local Outbreak",
    "Nearby Outbreaks",
    "Travel Alert",
    "Public Health Announcements",
  ].map((type) => ({ value: type, label: type }));

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axiosInstance.get("/api/public/district");
        setDistricts(response.data.content);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    const fetchAlerts = async () => {
      try {
        const url =
          selectedFilter === "all"
            ? "/api/public/alerts"
            : "/api/public/alerts/district";
        const response = await axiosInstance.get(url);
        setAlerts(response.data.content);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError("No alerts found for the specified district.");
        } else {
          setError("Error fetching alerts.");
        }
        setAlerts([]);
      }
    };

    fetchDistricts();
    fetchAlerts();
  }, [selectedFilter]);

  const handleCreateAlert = async (districtId) => {
    try {
      const response = await axiosInstance.post(
        `/api/public/alerts/${districtId}`,
        newAlert
      );
      setAlerts((prev) => [...prev, response.data]); // Add the new alert to the table
      alert("Alert created successfully!");
      setNewAlert({ alertType: "", alertDescription: "" }); // Reset the form
    } catch (error) {
      console.error("Error creating alert:", error);
      alert("Failed to create alert");
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/admin/alerts/${alertId}`
      );
      // Remove the deleted alert from the table
      setAlerts((prev) => prev.filter((alert) => alert.alertId !== alertId));
      alert("Alert deleted successfully!");
      console.log("Deleted alert:", response.data); // Log the deleted alert object
    } catch (error) {
      console.error("Error deleting alert:", error);
      alert("Failed to delete alert");
    }
  };

  // Prepare options for react-select dropdown
  const filterOptions = [
    { value: "all", label: "All Districts" },
    { value: "moh", label: "My District Alerts" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black">Alerts</h2>
      <div className="mb-4">
        <label className="text-black font-semibold">Filter:</label>
        <Select
          className="ml-2 text-black"
          options={filterOptions}
          value={filterOptions.find(
            (option) => option.value === selectedFilter
          )}
          onChange={(selectedOption) => setSelectedFilter(selectedOption.value)}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: "#ccc", // Adjust border color for the dropdown
              color: "black", // Ensure text is black
            }),
            singleValue: (provided) => ({
              ...provided,
              color: "black", // Ensure selected value text is black
            }),
          }}
        />
      </div>

      {/* Create Alert Section */}
      <h3 className="text-lg font-bold text-black mt-6">Create Alert</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const districtId = 1; // Assuming districtId is dynamically passed based on the logged-in user
          handleCreateAlert(districtId);
        }}
        className="mt-4"
      >
        <label className="block text-black font-semibold">Alert Type:</label>
        <Select
          options={alertTypes}
          value={alertTypes.find((type) => type.value === newAlert.alertType)}
          onChange={(option) =>
            setNewAlert({ ...newAlert, alertType: option.value })
          }
          className="mb-4 text-black"
        />

        <label className="block text-black font-semibold">
          Alert Description:
        </label>
        <textarea
          value={newAlert.alertDescription}
          onChange={(e) =>
            setNewAlert({
              ...newAlert,
              alertDescription: e.target.value,
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
          Create Alert
        </button>
      </form>

      {/* Alerts Table Section */}
      <h3 className="text-lg font-bold text-black mt-6">Existing Alerts</h3>
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4 table-fixed">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black">Alert ID</th>
              <th className="border p-3 text-black">Type</th>
              <th className="border p-3 text-black">Description</th>
              <th className="border p-3 text-black">District</th>
              <th className="border p-3 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr key={alert.alertId} className="border">
                  <td className="border p-3 text-black">{alert.alertId}</td>
                  <td className="border p-3 text-black">{alert.alertType}</td>
                  <td className="border p-3 text-black break-words max-w-xs">
                    {alert.alertDescription}
                  </td>
                  <td className="border p-3 text-black">
                    {alert.districtName}
                  </td>
                  <td className="border p-3 text-black">
                    <button
                      onClick={() => handleDeleteAlert(alert.alertId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No alerts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertsPanel;
