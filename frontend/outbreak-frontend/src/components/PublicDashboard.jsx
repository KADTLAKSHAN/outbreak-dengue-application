import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardNavBar from "./DashboardNav";
import CasePredictionPanel from "./CasePredictionPanel";
import ComplaintPanel from "./ComplaintPanel";
import BarChartDistrict from "./BarChartDistrict";
import LineGraphWeek from "./LineGraphWeek";

function PublicDashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/api/public/user");
        const data = response.data;
        setUser(data);
        setUpdatedUser({
          firstName: data.firstName,
          lastName: data.lastName,
        });
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(
        "/api/public/users/profile",
        updatedUser
      );
      const data = response.data;
      setUser(data);
      setIsEditing(false);
      setError(null);
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

  return (
    <div>
      <DashboardNavBar onLogout={onLogout} />

      <div className="flex">
        {/* Side Panel */}
        <div className="w-1/4 bg-gray-900 p-4 min-h-screen">
          <ul className="space-y-4">
            {["Dashboard", "Profile", "Case Prediction", "Complaints"].map(
              (tab) => (
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
              )
            )}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 p-6">
          <h1 className="text-black text-2xl mb-4">Public User Dashboard</h1>

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

              {/* Add Data Visualization Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-black mb-6 text-center">
                  Data Visualization
                </h3>

                {/* Add the BarChart component */}
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-black mb-4">
                    District-wise Dengue Cases
                  </h4>
                  <BarChartDistrict />
                </div>
                <div className="mb-8">
                  <h4 className="text-md font-semibold text-black mb-4">
                    Weekly Dengue Cases
                  </h4>
                  <LineGraphWeek />
                </div>

                {/* Add more graphs here */}
                {/* Example: Another Graph */}
                {/* <div className="mb-8">
                  <h4 className="text-md font-semibold text-black mb-4">
                    Monthly Dengue Cases
                  </h4>
                  <AnotherGraphComponent />
                </div> */}
              </div>
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
                  <strong>First Name:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={updatedUser.firstName}
                      onChange={handleChange}
                      className="bg-gray-100 text-black p-2 rounded-md mt-2"
                    />
                  ) : (
                    user.firstName
                  )}
                </p>
                <p className="text-black">
                  <strong>Last Name:</strong>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={updatedUser.lastName}
                      onChange={handleChange}
                      className="bg-gray-100 text-black p-2 rounded-md mt-2"
                    />
                  ) : (
                    user.lastName
                  )}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                {isEditing ? (
                  <button
                    onClick={handleUpdate}
                    className="btn btn-sm bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 shadow-md text-white px-6 py-2 rounded-full"
                  >
                    Update Profile
                  </button>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="btn btn-sm bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 shadow-md text-white px-6 py-2 rounded-full"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "Case Prediction" && <CasePredictionPanel />}
          {activeTab === "Complaints" && <ComplaintPanel />}
        </div>
      </div>
    </div>
  );
}

export default PublicDashboard;
