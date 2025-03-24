import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaChartLine,
  FaComments,
  FaTachometerAlt,
  FaBell,
  FaNewspaper,
} from "react-icons/fa";
import DashboardNavBar from "./DashboardNav";
import CasePredictionPanel from "./CasePredictionPanel";
import AlertsPanel from "./AlertsPanel";
import MOHComplaintsPanel from "./MOHComplaintsPanel";
import ManageArticles from "./ManageArticles";
import BarChartDistrict from "./BarChartDistrict";
import LineGraphWeek from "./LineGraphWeek";
import LineGraphYear from "./LineGraphYear";

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
              { name: "Dashboard", icon: <FaTachometerAlt /> },
              { name: "Profile", icon: <FaUser /> },
              { name: "Case Prediction", icon: <FaChartLine /> },
              { name: "Alerts", icon: <FaBell /> },
              { name: "Complaints", icon: <FaComments /> },
              { name: "Manage Articles", icon: <FaNewspaper /> },
            ].map(({ name, icon }) => (
              <li
                key={name}
                className={`p-3 flex items-center gap-2 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-all ${
                  activeTab === name
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 font-bold shadow-lg"
                    : "bg-gray-700"
                }`}
                onClick={() => setActiveTab(name)}
              >
                {icon} {name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
          )}

          {activeTab === "Dashboard" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg text-white text-center shadow-lg">
                <h2 className="text-3xl font-bold">
                  Welcome, {user?.firstName}! 👋
                </h2>
                <p className="text-lg mt-2">
                  As a Ministry of Health (MOH) official, you have access to
                  critical tools and insights to monitor, manage, and combat
                  dengue outbreaks. Stay informed and take action with real-time
                  data and predictive analytics. 🚀
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-black mb-6 text-center">
                  📊 Dengue Data Insights
                </h3>
                <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-black mb-4 border-l-4 border-blue-500 pl-3">
                    🌍 District-wise Dengue Cases
                  </h4>
                  <BarChartDistrict />
                </div>
                <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-black mb-4 border-l-4 border-green-500 pl-3">
                    📅 Weekly Dengue Trends
                  </h4>
                  <LineGraphWeek />
                </div>
                <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-black mb-4 border-l-4 border-purple-500 pl-3">
                    📆 Dengue Cases Over the Years
                  </h4>
                  <LineGraphYear />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Profile" && user && (
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex items-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-3xl font-bold">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-black">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <div className="space-y-4">
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
          {activeTab === "Manage Articles" && <ManageArticles />}
        </div>
      </div>
    </div>
  );
}

export default MOHDashboard;
