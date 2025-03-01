import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "./components/TopNav";
import AdminPanel from "./components/AdminPanel";
import MOHPanel from "./components/MOHPanel";
import PublicPanel from "./components/PublicPanel";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="bg-site min-h-screen text-white">
      <TopNav username={user.username} />
      <div className="container mx-auto py-8">
        {user.roles.includes("ROLE_ADMIN") ? (
          <AdminPanel />
        ) : user.roles.includes("ROLE_MOH_USER") ? (
          <MOHPanel />
        ) : (
          <PublicPanel />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
