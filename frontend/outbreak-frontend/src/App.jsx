import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Nav from "./components/Nav";
import About from "./components/About";
import Alerts from "./components/Alerts";
import Articles from "./components/Articles";
import Analysis from "./components/Analysis";
import DengueDetails from "./components/DengueDetails";
import LoginRegisterModal from "./components/LoginRegisterModal";
import PublicDashboard from "./components/PublicDashboard";
import MOHDashboard from "./components/MOHDashboard";
import AdminPanel from "./components/AdminPanel";
import Diagram from "./components/Diagram";

function Homepage({ isAuthOpen, setIsAuthOpen }) {
  const [isArticlePopupOpen, setIsArticlePopupOpen] = useState(false);
  return (
    <div className="bg-site bg-no-repeat bg-cover overflow-hidden">
      <Header isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen} />
      <Banner />
      {!isAuthOpen && <Nav isArticlePopupOpen={isArticlePopupOpen} />}
      <Alerts />
      <Analysis />
      <DengueDetails />
      <Articles setIsArticlePopupOpen={setIsArticlePopupOpen} />
      <Diagram />
      <About />
    </div>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    // Retrieve userRole from localStorage on initial load
    const storedUserRole = localStorage.getItem("userRole");
    return storedUserRole || null;
  });

  useEffect(() => {
    const updateUserRole = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);

          // Ensure the user object has a roles property
          if (user && Array.isArray(user.roles)) {
            // Prioritize roles correctly
            if (user.roles.includes("ROLE_ADMIN")) {
              setUserRole("admin");
            } else if (user.roles.includes("ROLE_MOH_USER")) {
              setUserRole("moh");
            } else if (user.roles.includes("ROLE_PUBLIC_USER")) {
              setUserRole("public");
            } else {
              setUserRole(null);
            }
          } else {
            console.error("Invalid user data in localStorage:", user);
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    updateUserRole();
    window.addEventListener("storage", updateUserRole);
    return () => window.removeEventListener("storage", updateUserRole);
  }, []);

  // Persist userRole to localStorage whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem("userRole", userRole);
    } else {
      localStorage.removeItem("userRole");
    }
  }, [userRole]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (!response.ok) {
        throw new Error("Failed to logout. Please try again.");
      }

      // Clear local storage and cookies after successful logout
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      document.cookie =
        "springBootDengue=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

      // Redirect to homepage
      window.location.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out. Please try again.");
    }
  };

  const handleLoginSuccess = (userData) => {
    try {
      const user = JSON.parse(userData);

      // Ensure the user object has a roles property
      if (user && Array.isArray(user.roles)) {
        if (user.roles.includes("ROLE_ADMIN")) {
          setUserRole("admin");
        } else if (user.roles.includes("ROLE_MOH_USER")) {
          setUserRole("moh");
        } else if (user.roles.includes("ROLE_PUBLIC_USER")) {
          setUserRole("public");
        } else {
          setUserRole(null);
        }
      } else {
        console.error("Invalid user data from login:", user);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error parsing user data from login:", error);
      setUserRole(null);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <Homepage isAuthOpen={isAuthOpen} setIsAuthOpen={setIsAuthOpen} />
          }
        />

        {/* Dashboard Route with Role-Based Redirection */}
        <Route
          path="/dashboard"
          element={
            userRole === "admin" ? (
              <AdminPanel onLogout={handleLogout} />
            ) : userRole === "moh" ? (
              <MOHDashboard onLogout={handleLogout} />
            ) : userRole === "public" ? (
              <PublicDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <LoginRegisterModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </Router>
  );
}

export default App;
