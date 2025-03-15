import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavBar from "./DashboardNav";
import CasePredictionPanel from "./CasePredictionPanel";
import AlertsPanel from "./AlertsPanel";
import MOHComplaintsPanel from "./MOHComplaintsPanel";

function MOHDashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/public/user");
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          onLogout();
          navigate("/login");
        } else {
          setError(error.message);
        }
      }
    };
    fetchUserDetails();
  }, []);

  return (
    <div>
      <DashboardNavBar onLogout={onLogout} />
      <div className="flex">
        {/* Side Panel */}
        <div className="w-1/4 bg-gray-900 p-4 min-h-screen">
          <ul className="space-y-4">
            {[
              "Dashboard",
              "Profile",
              "Case Prediction",
              "Alerts",
              "Complaints",
            ].map((tab) => (
              <li
                key={tab}
                className={`p-3 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg"
                    : "bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <h1 className="text-black text-2xl mb-4">MOH User Dashboard</h1>

          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
          )}

          {/* Render Active Tab */}
          {activeTab === "Dashboard" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-black">
                Welcome, {user?.firstName}!
              </h2>
              <p className="text-gray-700">Explore the dashboard features.</p>
            </div>
          )}

          {activeTab === "Profile" && user && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-black">Profile Details</h2>
              <div>
                <p className="text-black">
                  <strong>Username:</strong> {user.userName}
                </p>
                <p className="text-black">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="text-black">
                  <strong>First Name:</strong> {user.firstName}
                </p>
                <p className="text-black">
                  <strong>Last Name:</strong> {user.lastName}
                </p>
              </div>
            </div>
          )}

          {activeTab === "Case Prediction" && <CasePredictionPanel />}
          {activeTab === "Alerts" && <AlertsPanel />}
          {activeTab === "Complaints" && <MOHComplaintsPanel />}
        </div>
      </div>
    </div>
  );
}

export default MOHDashboard;
