//image
import Image from "../assets/bannerlogo3.png";
//icon
import { FaGithub, FaYoutube, FaDribbble } from "react-icons/fa";
//type animation
import { TypeAnimation } from "react-type-animation";
//motion
import { motion } from "framer-motion";
//variant
import { fadeIn } from "../variants";
//link
import { Link } from "react-scroll";

function Banner() {
  return (
    <section
      className="min-h-[85vh] lg:min-h-[78vh] flex items-center"
      id="home"
    >
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-8 lg:flex-row lg:items-center lg:gap-x-12">
          {/* text */}
          <div className="flex-1 text-center font-secondary lg:text-left">
            <motion.h1
              variants={fadeIn("up", 0.3)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-[55px] font-bold leading-[0.8] lg:text-[110px]"
            >
              DENGUE <span>INSIGHTS</span>
            </motion.h1>
            <motion.div
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="mb-6 text-[36px] lg:text-[60px] font-secondary font-semibold uppercase leading-[1]"
            >
              <span className="mr-4">Stay</span>
              <TypeAnimation
                sequence={["INFORMED", 2000, "PROTECTED", 2000, "AHEAD", 2000]}
                speed={50}
                className="text-rose-600"
                wrapper="span"
                repeat={Infinity}
              />
            </motion.div>
            <motion.p
              variants={fadeIn("up", 0.5)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Track dengue trends with real-time predictions. Get accurate
              forecasts and take proactive steps to safeguard your community.
            </motion.p>
            <motion.div
              variants={fadeIn("up", 0.6)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="flex max-w-max gap-x-6 items-center mb-12 mx-auto lg:mx-0"
            >
              <button className="btn btn-lg">Predict Dengue Cases</button>
              <Link
                to="Diagram"
                smooth={true} // Enables smooth scrolling
                duration={1000} // duration of the scroll (in ms)
                className="text-gradient btn-link cursor-pointer"
              >
                View Disease Trends
              </Link>
            </motion.div>
          </div>
          {/* image */}
          <motion.div
            variants={fadeIn("down", 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.7 }}
            className="hidden lg:flex flex-1 max-w-[320px] lg:max-w-[480px]"
          >
            <img src={Image} alt="" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
