import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    divisionId: null,
    role: [],
  });
  const [editUser, setEditUser] = useState({
    userId: null,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    divisionId: null,
  });
  const [roles] = useState([
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "mohUser", label: "MOH User" },
  ]);
  const [divisions, setDivisions] = useState([]);

  // Get logged-in user details from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    fetchUsers();
    fetchDivisions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/public/users");
      setUsers(response.data.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDivisions = async () => {
    try {
      const response = await axiosInstance.get("/api/public/division");
      setDivisions(
        response.data.map((division) => ({
          value: division.divisionId,
          label: division.divisionName,
        }))
      );
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    // Prevent logged-in user from deleting their own account
    if (userId === loggedInUser.id) {
      alert("You cannot delete your own account.");
      return;
    }

    try {
      await axiosInstance.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user.userId !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();

    // Ensure divisionId is selected
    if (!newUser.divisionId) {
      alert("Please select a division.");
      return;
    }

    // Ensure at least one role is selected
    if (newUser.role.length === 0) {
      alert("Please select at least one role.");
      return;
    }

    // Validate password length
    if (newUser.password.length < 6 || newUser.password.length > 40) {
      alert("Password must be between 6 and 40 characters.");
      return;
    }

    // Convert roles from react-select format to an array of role names
    const formattedRoles = newUser.role.map((r) => r.value);

    const userData = {
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
      divisionId: newUser.divisionId.value, // Extract division ID correctly
      role: formattedRoles, // Send array of role names
    };

    try {
      console.log(userData);

      await axiosInstance.post("/api/auth/signup", userData);
      alert("User registered successfully!");

      // Reset the form
      setNewUser({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        divisionId: null,
        role: [],
      });

      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response && error.response.data) {
        // Display the backend error message
        alert(`Failed to register user: ${error.response.data.password}`);
      } else {
        alert("Failed to register user. Please try again.");
      }
    }
  };

  const handleEditUser = (user) => {
    // Prevent logged-in user from editing their own account
    if (user.userName === loggedInUser.username) {
      alert("You cannot update your own account.");
      return;
    }

    setEditUser({
      userId: user.userId,
      username: user.userName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: "",
      divisionId: divisions.find((div) => div.value === user.divisionId),
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // Ensure divisionId is selected
    if (!editUser.divisionId) {
      alert("Please select a division.");
      return;
    }

    const userData = {
      userName: editUser.username,
      email: editUser.email,
      firstName: editUser.firstName,
      lastName: editUser.lastName,
      password: editUser.password,
      divisionId: editUser.divisionId.value,
    };

    try {
      const response = await axiosInstance.put(
        `/api/public/users/${editUser.userId}`,
        userData
      );
      if (response.status === 200) {
        alert("User updated successfully!");
        setEditUser({
          userId: null,
          username: "",
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          divisionId: null,
        });
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response && error.response.data) {
        alert(`Failed to update user: ${error.response.data.message}`);
      } else {
        alert("Failed to update user. Please try again.");
      }
    }
  };

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
    multiValue: (provided) => ({
      ...provided,
      color: "black", // Ensure selected values text is black
    }),
    option: (provided) => ({
      ...provided,
      color: "black", // Ensure dropdown options text is black
    }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-black">User Management</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="w-full p-2 border rounded-md text-black mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black w-1/6">User ID</th>
              <th className="border p-3 text-black w-1/6">Username</th>
              <th className="border p-3 text-black w-1/6">Email</th>
              <th className="border p-3 text-black w-1/6">First Name</th>
              <th className="border p-3 text-black w-1/6">Last Name</th>
              <th className="border p-3 text-black w-1/6">Division</th>
              <th className="border p-3 text-black w-1/6">Roles</th>
              <th className="border p-3 text-black w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => user.userName.includes(searchTerm))
              .map((user) => (
                <tr key={user.userId} className="border">
                  <td className="border p-3 text-black break-words">
                    {user.userId}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.userName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.email}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.firstName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.lastName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.divisionName}
                  </td>
                  <td className="border p-3 text-black break-words">
                    {user.roles ? user.roles.join(", ") : "N/A"}
                  </td>
                  <td className="border p-3 text-black break-words">
                    <button
                      onClick={() => handleDeleteUser(user.userId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mb-4"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Register New User */}
      <h3 className="text-lg font-bold text-black mt-6">Register New User</h3>
      <form onSubmit={handleRegisterUser} className="mt-4">
        <label className="block text-black font-semibold">Username:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          required
        />

        <label className="block text-black font-semibold">Email:</label>
        <input
          type="email"
          className="w-full p-2 border rounded-md text-black"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />

        <label className="block text-black font-semibold">First Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
          required
        />

        <label className="block text-black font-semibold">Last Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md text-black"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          required
        />

        <label className="block text-black font-semibold">Password:</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md text-black"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />

        <label className="block text-black font-semibold">Division:</label>
        <Select
          options={divisions}
          value={newUser.divisionId}
          onChange={(selected) =>
            setNewUser({ ...newUser, divisionId: selected })
          }
          styles={customStyles} // Apply custom styles
        />

        <label className="block text-black font-semibold">Roles:</label>
        <Select
          options={roles}
          isMulti
          value={newUser.role}
          onChange={(selected) => setNewUser({ ...newUser, role: selected })}
          styles={customStyles} // Apply custom styles
        />

        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white p-3 rounded-md"
        >
          Register User
        </button>
      </form>

      {/* Edit User Form */}
      {editUser.userId && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-black">Edit User</h3>
          <form onSubmit={handleUpdateUser} className="mt-4">
            <label className="block text-black font-semibold">Username:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editUser.username}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
              required
              disabled={editUser.userId === loggedInUser.id} // Disable username field for logged-in user
            />

            <label className="block text-black font-semibold">Email:</label>
            <input
              type="email"
              className="w-full p-2 border rounded-md text-black"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              required
            />

            <label className="block text-black font-semibold">
              First Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editUser.firstName}
              onChange={(e) =>
                setEditUser({ ...editUser, firstName: e.target.value })
              }
              required
            />

            <label className="block text-black font-semibold">Last Name:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md text-black"
              value={editUser.lastName}
              onChange={(e) =>
                setEditUser({ ...editUser, lastName: e.target.value })
              }
              required
            />

            <label className="block text-black font-semibold">Password:</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md text-black"
              value={editUser.password}
              onChange={(e) =>
                setEditUser({ ...editUser, password: e.target.value })
              }
            />

            <label className="block text-black font-semibold">Division:</label>
            <Select
              options={divisions}
              value={editUser.divisionId}
              onChange={(selected) =>
                setEditUser({ ...editUser, divisionId: selected })
              }
              styles={customStyles} // Apply custom styles
            />

            <button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-3 rounded-md"
            >
              Update User
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
