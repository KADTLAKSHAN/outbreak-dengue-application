import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginRegisterModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    divisionId: "",
  });
  const [divisions, setDivisions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/public/division")
      .then((res) => res.json())
      .then((data) => setDivisions(data))
      .catch((err) => console.error("Error fetching divisions:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:8080/api/auth/signin"
      : "http://localhost:8080/api/auth/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      console.log("Response:", data);

      if (isLogin) {
        // Ensure the response contains user data
        if (data && data.roles) {
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(data));
          alert("Login successful!");
          onClose();
          onLoginSuccess(JSON.stringify(data)); // Call the callback here
          navigate("/dashboard");
        } else {
          throw new Error("Invalid user data in login response");
        }
      } else {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Login failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
      <div className="bg-site p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-white text-lg hover:scale-110 transition-transform"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="h2 text-center text-gradient mb-4">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-white font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium">
                  Select Division
                </label>
                <select
                  name="divisionId"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
                  value={formData.divisionId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose your division</option>
                  {divisions.map((division) => (
                    <option
                      key={division.divisionId}
                      value={division.divisionId}
                    >
                      {division.divisionName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="block text-white font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ring-offset-2"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-lg w-full font-semibold transition duration-300 hover:bg-opacity-80">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          {isLogin ? "New user?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gradient font-medium hover:underline"
          >
            {isLogin ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginRegisterModal;
