//countup
import CountUp from "react-countup";
//intersection observer
import { useInView } from "react-intersection-observer";
//motion
import { motion } from "framer-motion";
//variant
import { fadeIn } from "../variants";

function About() {
  const [ref, inView] = useInView({
    threshold: 0.5,
  });

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-10 lg:flex-row lg:items-center lg:gap-x-20 lg:gap-y-0 h-screen">
          {/* img */}
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 bg-about bg-contain bg-no-repeat h-[640px] mix-blend-lighten bg-top"
          ></motion.div>
          {/* text */}
          <motion.div
            variants={fadeIn("left", 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1"
          >
            <h2 className="h2 text-pink-500">About Dengue</h2>
            <h3 className="h3 mb-4">
              A mosquito-borne disease affecting millions worldwide.
            </h3>
            <p className="mb-6">
              Dengue is a viral infection spread by mosquitoes, primarily in
              tropical and subtropical regions. Symptoms include high fever,
              severe headaches, muscle and joint pain, and skin rashes. Early
              detection and prevention measures are crucial to controlling
              outbreaks.
            </p>
            {/* stats */}
            <div className="flex gap-x-6 lg:gap-x-10 mb-12">
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? <CountUp start={0} end={100} duration={3} /> : null}
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Affected <br />
                  Countries (More)
                </div>
              </div>
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? (
                    <CountUp start={0} end={200000} duration={3} />
                  ) : null}
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Reported <br />
                  Cases
                </div>
              </div>
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? <CountUp start={0} end={10} duration={3} /> : null}
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Death <br />
                  Cases (More)
                </div>
              </div>
            </div>
            <div className="flex gap-x-8 items-center">
              <button className="btn btn-lg">Learn More</button>
              <a href="#" className="text-gradient btn-link">
                Prevention Tips
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;
