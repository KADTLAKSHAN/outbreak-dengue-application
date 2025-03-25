// Motion
import { motion } from "framer-motion";
// Variants
import { fadeIn } from "../variants";
// Animations
import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
// Hooks
import { useState, useEffect } from "react";

function Analysis() {
  const [districts, setDistricts] = useState(["Colombo"]); // Default district
  const [cases, setCases] = useState({ Colombo: 250 }); // Default case count
  const [currentDistrict, setCurrentDistrict] = useState("Colombo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/public/caseData/get"
        );
        const data = await response.json();

        // Create a mapping of district -> cases
        const districtCases = {};
        data.forEach((item) => {
          districtCases[item.districtName] = item.noCases;
        });

        // Extract district names
        const districtNames = Object.keys(districtCases);

        setDistricts(districtNames);
        setCases(districtCases);
        setCurrentDistrict(districtNames[0]); // Start with first district
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="section" id="analysis">
      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="container mx-auto"
      >
        {/* Heading */}
        <div className="text-center mb-15">
          <h2 className="h2 font-bold mb-5">Dengue Outbreak Analysis</h2>
          <p className="text-gray-400 text-lg mt-2">
            Stay informed with real-time dengue statistics for your district.
          </p>
        </div>

        {/* wrapper */}
        <div className="flex flex-col xl:flex-row gap-y-6 justify-between ">
          {/* District (Animated) */}
          <div className="stats__item flex-1 xl:border-r flex flex-col items-center">
            <div className="text-4xl xl:text-[50px] font-semibold text-font-primary xl:mb-2">
              {!loading && (
                <TypeAnimation
                  sequence={[
                    ...districts.flatMap((d) => [
                      () => setCurrentDistrict(d), // Update district state
                      d,
                      2000,
                    ]),
                  ]}
                  speed={50}
                  className="font-semibold text-font-primary"
                  wrapper="span"
                  repeat={Infinity}
                />
              )}
            </div>
            <div>District</div>
          </div>

          {/* Year (Static) */}
          <div className="analysis__item flex-1 xl:border-r flex flex-col items-center">
            <div className="text-4xl xl:text-[50px] font-semibold text-font-primary xl:mb-2">
              2025
            </div>
            <div>Year</div>
          </div>

          {/* Month (Static) */}
          <div className="stats__item flex-1 xl:border-r flex flex-col items-center">
            <div className="text-4xl xl:text-[50px] font-semibold text-font-primary xl:mb-2">
              March
            </div>
            <div>Month</div>
          </div>

          {/* Dengue Cases (Updates with District) */}
          <div className="stats__item flex-1 flex flex-col items-center">
            <div className="text-4xl xl:text-[50px] font-semibold text-font-primary text-font-primary xl:mb-2">
              {!loading ? (
                <CountUp
                  start={0}
                  end={cases[currentDistrict] || 0} // Show case count for active district
                  duration={2}
                  key={currentDistrict} // Ensure CountUp restarts on district change
                />
              ) : (
                "..."
              )}
            </div>
            <div>Dengue Reported Cases</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default Analysis;
