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
          <ColumnChart />
        </motion.div>
      </div>
    </section>
  );
}

export default Diagram;
