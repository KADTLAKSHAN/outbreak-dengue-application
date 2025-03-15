import { useState, useEffect } from "react";
import axios from "axios";

function MOHComplaintsPanel() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axiosInstance.get("/api/public/complaints");
        setComplaints(response.data.content);
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setError("No complaints found.");
        } else {
          setError("Error fetching complaints.");
        }
        setComplaints([]);
      }
    };

    fetchComplaints();
  }, []);

  const handleReply = async (complaintId) => {
    if (!replyText[complaintId] || replyText[complaintId].trim() === "") {
      alert("Please enter a reply before submitting.");
      return;
    }

    try {
      await axiosInstance.put(`/api/public/complaints/${complaintId}`, {
        complaintReply: replyText[complaintId],
      });

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.complaintId === complaintId
            ? {
                ...complaint,
                status: true,
                complaintReply: replyText[complaintId],
              }
            : complaint
        )
      );

      alert("Reply sent successfully!");
      setReplyText((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (error) {
      console.error("Error replying to complaint:", error);
      alert("Failed to send reply.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-black">Complaints Management</h2>

      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-3 text-black">Complaint ID</th>
              <th className="border p-3 text-black">Complaint Type</th>
              <th className="border p-3 text-black">Description</th>
              <th className="border p-3 text-black">Status</th>
              <th className="border p-3 text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <tr key={complaint.complaintId} className="border">
                  <td className="border p-3 text-black">
                    {complaint.complaintId}
                  </td>
                  <td className="border p-3 text-black break-words max-w-xs">
                    {complaint.complaintType}
                  </td>
                  <td className="border p-3 text-black break-words max-w-xs">
                    {complaint.complaintDetails}
                  </td>
                  <td className="border p-3 text-black">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                        complaint.status ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {complaint.status ? "Replied" : "Pending"}
                    </span>
                  </td>
                  <td className="border p-3 text-black">
                    {!complaint.status ? (
                      <div>
                        <textarea
                          value={replyText[complaint.complaintId] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [complaint.complaintId]: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded-md text-black"
                          rows="2"
                          placeholder="Enter reply..."
                          required
                        ></textarea>
                        <button
                          onClick={() => handleReply(complaint.complaintId)}
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                        >
                          Send Reply
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Replied</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No complaints available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MOHComplaintsPanel;
