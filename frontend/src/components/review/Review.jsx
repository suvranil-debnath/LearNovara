import React, { useEffect } from "react";
import "./review.css";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaUsers, FaStar, FaShoppingCart, FaClock, FaGlobe, FaAward } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const reviewers = [
  {
    heading: "Outstanding Service!",
    ig: "https://avatar.iran.liara.run/public/67",
    name: "John Doe",
    desc: "The team provided exceptional support and made the entire process seamless.",
  },
  {
    heading: "Highly Recommended!",
    ig: "https://avatar.iran.liara.run/public/68",
    name: "Jane Smith",
    desc: "I love the quality of the products and their dedication to customer satisfaction.",
  },
  {
    heading: "Top-notch Experience!",
    ig: "https://avatar.iran.liara.run/public/69",
    name: "Alice Johnson",
    desc: "Absolutely brilliant! Their attention to detail is second to none.",
  },
  {
    heading: "Superb Quality!",
    ig: "https://avatar.iran.liara.run/public/70",
    name: "Bob Brown",
    desc: "Fantastic quality and the delivery was right on time. Highly satisfied.",
  },
];

const statistics = [
  { icon: <FaUsers />, st: "15k+", info: "Happy Users" },
  { icon: <FaStar />, st: "10k+", info: "5-Star Reviews" },
  { icon: <FaShoppingCart />, st: "1M+", info: "Courses Sold" },
  { icon: <FaClock />, st: "24/7", info: "Support Availability" },
  { icon: <FaGlobe />, st: "50+", info: "Countries Served" },
  { icon: <FaAward />, st: "500+", info: "Industry Awards" },
];

const RevHeadLineCard = ({ content }) => (
  <div className="rev-headline-card">
    <FaQuoteLeft className="rev-quote-icon" />
    <p className="rev-card-desc">{content.desc}</p>
    <div className="rev-card-footer">
      <img src={content.ig} alt={content.name} className="rev-head-avatar" />
      <h3>{content.name}</h3>
    </div>
  </div>
);

const RevStatCard = ({ stat }) => (
  <div className="rev-stat-card">
    <div className="rev-icon-container">{stat.icon}</div>
    <h2>{stat.st}</h2>
    <p>{stat.info}</p>
  </div>
);

const Review = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="rev-review-container">
      <section className="rev-top-section">
        <div className="rev-headline-cards" data-aos="fade-right">
          {reviewers.slice(0, 2).map((review, index) => (
            <RevHeadLineCard key={index} content={review} />
          ))}
        </div>
        <div className="rev-review-summary" data-aos="fade-left">
          <h1 className="rev-section-title">
            What <span className="rev-highlight">People</span> Say
          </h1>
          <div className="rev-stats-grid">
            {statistics.map((stat, index) => (
              <RevStatCard key={index} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="rev-bottom-section">
        <h2 className="rev-more-reviews-title" data-aos="fade-up">
          More <span className="rev-highlight">Reviews</span>
        </h2>
        <div className="rev-slider-container">
          <motion.div
            className="rev-slider"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 20, // Adjust for speed
              ease: "linear",
            }}
          >
            {[...reviewers, ...reviewers].map((review, index) => (
              <div key={index} className="rev-review-item">
                <img src={review.ig} alt={review.name} className="rev-review-avatar" />
                <div className="rev-review-text">
                  <h4 className="rev-review-name">{review.name}</h4>
                  <p className="rev-review-desc">{review.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Review;
