// Store Values
import { useState } from "react";
// Icon
import { FaPlus, FaMinus } from "react-icons/fa6";
// Motion
import { motion } from "framer-motion";
// Variants
import { fadeIn } from "../variants";

function DengueDetails() {
  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState(null);

  // Function to toggle FAQ
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // FAQ Data
  const faqData = [
    {
      question: "How can I protect myself from dengue fever?",
      answer:
        "To protect yourself from dengue fever, take measures to prevent mosquito bites. Wear protective clothing, use mosquito repellents (such as citronella oil or DEET-based repellents), and install mosquito-proof screens on doors and windows. Avoid outdoor activities during peak mosquito activity hours—mid-morning and late afternoon.",
    },
    {
      question: "What should I do if I suspect I have dengue fever?",
      answer:
        "If you have a fever, rest adequately, stay hydrated with fluids like fruit juices and soup, and monitor urine output. Take only paracetamol for fever control and avoid NSAIDs like ibuprofen or diclofenac. If symptoms persist beyond two days, visit a hospital for a blood test. Seek immediate medical attention if you experience warning signs like severe abdominal pain, vomiting, or dizziness.",
    },
    {
      question: "How is dengue transmitted?",
      answer:
        "Dengue is transmitted through the bite of infected Aedes aegypti and Aedes albopictus mosquitoes. These mosquitoes lay their eggs in water-filled containers, and their larvae develop into adult mosquitoes within 8-10 days. They are most active during daylight hours, especially in urban areas.",
    },
    {
      question: "Why is dengue a global health concern?",
      answer:
        "Dengue is a significant health issue worldwide, particularly in tropical and subtropical regions. It affects millions annually, with hundreds of thousands developing severe dengue hemorrhagic fever. The WHO estimates that over 2.5 billion people are at risk, and dengue is now present in more than 100 countries.",
    },
    {
      question: "What should I do if someone in my family has dengue?",
      answer:
        "If a family member has dengue, protect them from further mosquito bites to prevent transmission. Ensure they rest, stay hydrated, and seek medical attention if symptoms worsen. Take extra precautions by using mosquito nets and repellents, as dengue tends to spread within close family and neighborhood clusters.",
    },
  ];

  return (
    <section className="section" id="details">
      <motion.div
        variants={fadeIn("up", 0.4)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="container mx-auto"
      >
        {/* Section Title */}
        <h2 className="faq__title text-center text-3xl font-bold mb-20 h2">
          Dengue Insights: What You Need to Know
        </h2>

        {/* FAQ Items Wrapper */}
        <div className="max-w-5xl mx-auto">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="faq__item px-6 py-4 border-b cursor-pointer select-none"
              onClick={() => toggleFAQ(index)}
            >
              {/* Title and Icon */}
              <div className="flex items-center justify-between">
                {/* Question */}
                <h4 className="text-xl font-semibold">{item.question}</h4>

                {/* Toggle Icon */}
                <div className="text-accent text-2xl">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </div>
              </div>

              {/* Answer - Show only if open */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "h-auto mt-2" : "h-0 hidden"
                }`}
              >
                <p className="text-white-600 font-light">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default DengueDetails;
