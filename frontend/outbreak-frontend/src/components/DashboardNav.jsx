import { useState, useEffect } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardNavBar = ({ onLogout }) => {
  const [notifications, setNotifications] = useState([]);
  const [latestCases, setLatestCases] = useState([]);
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("User"); // State to store the username
  const navigate = useNavigate();

  // Fetch the logged-in username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/username",
          {
            credentials: "include", // Include cookies in the request
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            setError("Unauthorized access. Please log in again.");
            onLogout(); // Trigger logout
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch username");
        }

        const data = await response.text(); // Assuming the API returns the username as plain text
        setUsername(data);
      } catch (error) {
        console.error("Error fetching username:", error);
        setError("Failed to fetch username. Please try again later.");
      }
    };

    fetchUsername();
  }, [navigate, onLogout]);

  // Fetch notifications and case data for district
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/public/alerts/district",
          {
            credentials: "include", // Include cookies in the request
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            setError("Unauthorized access. Please log in again.");
            onLogout(); // Trigger logout
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        if (data.status === false) {
          // Handle case where no alerts are found
          setNotifications([]); // Set notifications to an empty array
        } else {
          setNotifications(data.content || []); // Ensure content is an array
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestCases = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/public/caseData/get",
          {
            credentials: "include", // Include cookies in the request
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch latest cases");
        }

        const data = await response.json();
        setLatestCases(data || []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching latest cases:", error);
        setError("Failed to fetch latest cases. Please try again later.");
      }
    };

    fetchNotifications();
    fetchLatestCases();
    const interval = setInterval(fetchLatestCases, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [navigate, onLogout]);

  // Rotate latest cases every few seconds
  useEffect(() => {
    if (latestCases.length > 0) {
      const interval = setInterval(() => {
        setCurrentCaseIndex(
          (prevIndex) => (prevIndex + 1) % latestCases.length
        );
      }, 5000); // Change every 5 seconds
      return () => clearInterval(interval);
    }
  }, [latestCases]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    onLogout(); // Call the logout handler passed from App.jsx
    navigate("/login");
  };

  return (
    <nav className="bg-black p-4 flex items-center justify-between shadow-md relative">
      <div className="text-white font-bold text-lg">
        Welcome, {username} <br />
        <span className="text-sm">{currentTime.toLocaleString()}</span>
      </div>

      <div className="bg-gradient-to-r from-[#42A6E3] to-[#FF56F6] text-white p-3 rounded-xl shadow-lg">
        {loading ? (
          <p>Loading latest cases...</p>
        ) : latestCases.length > 0 ? (
          <div className="text-center">
            <p className="font-bold">Latest Cases</p>
            <p className="text-sm">
              {latestCases[currentCaseIndex]?.districtName}:{" "}
              {latestCases[currentCaseIndex]?.noCases} cases (
              {latestCases[currentCaseIndex]?.caseMonth}{" "}
              {latestCases[currentCaseIndex]?.caseYear})
            </p>
          </div>
        ) : (
          <p>No cases found.</p>
        )}
      </div>

      <div className="flex items-center space-x-4 relative">
        <div className="relative">
          <Bell
            className="text-white cursor-pointer"
            size={28}
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-800 text-white shadow-lg rounded-lg p-2 max-h-60 overflow-auto z-50">
              <div className="font-bold text-lg p-2 border-b border-gray-700">
                Notifications
              </div>
              {notifications.length > 0 ? (
                notifications.map((alert) => (
                  <div
                    key={alert.alertId}
                    className="p-2 border-b border-gray-700 text-sm break-words"
                  >
                    <strong>{alert.districtName}</strong>:{" "}
                    <span className="break-words">
                      {alert.alertDescription}
                    </span>{" "}
                    <br />
                    <span className="text-xs text-gray-400">
                      Type: {alert.alertType}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-gray-400">
                  No new alerts
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-sm flex items-center space-x-2"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Display error message if any */}
      {/* {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center p-2">
          {error}
        </div>
      )} */}
    </nav>
  );
};

export default DashboardNavBar;
