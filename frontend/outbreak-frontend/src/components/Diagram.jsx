import ColumnChart from "./ColumnChart";
// Motion
import { motion } from "framer-motion";
// Variants
import { fadeIn } from "../variants";

function Diagram() {
  return (
    <section className="section" id="Diagram">
      <div className="container mx-auto">
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView={"show"}
          viewport={{ once: false, amount: 0.7 }}
          className="container mx-auto"
        >
          {/* Heading */}
          <div className="text-center mb-15">
            <h2 className="h2 font-bold mb-5">Yearly and Monthly Breakdown</h2>
            <p className="text-gray-400 text-lg mt-2">
              Identification of months with the highest case counts.
            </p>
          </div>

          <ColumnChart />
        </motion.div>
      </div>
    </section>
  );
}

export default Diagram;
