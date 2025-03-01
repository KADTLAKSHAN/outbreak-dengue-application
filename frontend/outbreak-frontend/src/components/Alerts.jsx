// Icons
import { BsArrowUpRight } from "react-icons/bs";
// Motion
import { motion } from "framer-motion";
// Variants
import { fadeIn } from "../variants";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/public/alerts"; // API endpoint

function Alerts() {
  const [alerts, setAlerts] = useState([]); // Stores alerts
  const [pageNumber, setPageNumber] = useState(0); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch alerts from API
  const fetchAlerts = async (page = 0) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${API_URL}?page=${page}&size=50`);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn("No alerts found (404). Displaying empty list.");
          setAlerts([]); // No records, keep array empty
          return;
        }
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Ensure data.content exists and filter out duplicates
      setAlerts((prev) => {
        const uniqueAlerts = new Map(prev.map((a) => [a.alertId, a])); // Avoid duplicate alerts
        data.content?.forEach((alert) =>
          uniqueAlerts.set(alert.alertId, alert)
        );
        return Array.from(uniqueAlerts.values());
      });

      setPageNumber(data.pageNumber || 0); // Update page number
      setTotalPages(data.totalpages || 1); // Update total pages
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Load initial alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <section className="section" id="alerts">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Text and Image */}
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 lg:bg-alerts lg:bg-bottom bg-no-repeat mix-blend-lighten mb-12 lg:mb-0"
          >
            <h2 className="h2 text-red-600 font-bold">Dengue Alerts</h2>
            <h3 className="h3 max-w-[455px] mb-16">
              <span className="text-lime-300">Stay updated</span> with the
              latest dengue alerts in your district.
            </h3>
            <button className="btn btn-sm">View More</button>
          </motion.div>

          {/* Alert List with Scroll */}
          <motion.div
            variants={fadeIn("left", 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 max-h-[400px] overflow-y-auto border border-gray-500 p-4 rounded-lg"
          >
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <div
                  className="border-b border-white/20 p-4 mb-4 flex justify-between"
                  key={alert.alertId} // Ensure unique keys
                >
                  <div>
                    <h4 className="text-[20px] font-primary font-semibold mb-2">
                      {alert.alertType} Alert
                    </h4>
                    <p className="font-secondary">{alert.alertDescription}</p>
                    <p className="text-sm text-gray-400">
                      District: {alert.districtName}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <BsArrowUpRight className="text-pink-400 text-2xl" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center font-semibold ">
                🔔 No alerts available.
              </p>
            )}

            {/* Load More Button */}
            {pageNumber + 1 < totalPages && (
              <button
                className="btn btn-sm mt-4 w-full"
                onClick={() => fetchAlerts(pageNumber + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More Alerts"}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Alerts;
