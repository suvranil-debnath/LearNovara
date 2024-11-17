import icon from "./tr-bg.png";
import "./review.css";
import wv1 from "../../assets/wave.png"
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles


const reviewers = [{
  heading : "Heading1",
  ig : "https://avatar.iran.liara.run/public/67",
  name: "Name 1",
  desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
},{
  heading : "Heading1=2",
  ig : "https://avatar.iran.liara.run/public/67",
  name: "Name 1",
  desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
},{
    heading : "Heading1=2",
    ig : "https://avatar.iran.liara.run/public/67",
    name: "Name 1",
    desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
  },{
    heading : "Heading1=2",
    ig : "https://avatar.iran.liara.run/public/67",
      name: "Name 1",
      desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
    },{
      heading : "Heading1=2",
      ig : "https://avatar.iran.liara.run/public/67",
        name: "Name 1",
        desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
      },{
        heading : "Heading1=2",
        ig : "https://avatar.iran.liara.run/public/67",
          name: "Name 1",
          desc : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
        }
]

const statistic = [{
  st : "15k",
  info : "sadas dasddfg  dfadfasd"
},{
  st : "15k",
  info : "sadas dasddfg  dfadfasd"
},{
  st : "15k",
  info : "sadas dasddfg  dfadfasd"
},{
  st : "15k",
  info : "sadas dasddfg  dfadfasd"
},]

const HeadLineCard = ({ content }) => {
  return (
    <div
      className="rev-headline-card shadow-sm"
      data-aos="slide-up"
      data-aos-delay="50"
    >
      
      <div className="rev-bottom mt-2">
      <span className="quote">&#8220;</span>
        <p className="rev-content">
          <span className="subtitle para">{content.desc}</span>
        </p>
      </div>

      <div className="rev-head">
        <div className="rev-content">
          <img src={content.ig} alt={content.name} />
          <h3 className="rev-headline">{content.name}</h3>
        </div>
      </div>
    </div>
  );
};

const Stats = ({ stat }) => {
  return (
    <div className="stats" data-aos="fade-up" data-aos-delay="100">
      <h2>{stat.st}</h2>
      <p>{stat.info}</p>
    </div>
  );
};

const ReviewCard = () => {
  return (
    <div className="review-card" data-aos="zoom-in" data-aos-delay="200">
      <div className="circle">
        <img src={icon} alt="Icon" className="icon" />
      </div>
      {statistic.map((e, index) => (
        <Stats key={index} stat={e} />
      ))}
    </div>
  );
};

const Review = () => {
  return (
    <div className="container-fluid review">
      <div className="rev-top-view">
        <div
          className="rev-left"
          data-aos="fade-right"
          data-aos-delay="50"
        >
          {reviewers.slice(0, 2).map((e, index) => (
            <HeadLineCard key={index} content={e} />
          ))}
        </div>
        <div
          className="rev-right"
          data-aos="fade-left"
          data-aos-delay="150"
        >
          <h1 className="rev-heading-text">
            Review <span className="transparent"> you </span> all shared
          </h1>
          <ReviewCard />
        </div>
      </div>
      <div className="rev-bottom-view">
        <div
          className="rev-left"
          data-aos="slide-right"
          data-aos-delay="50"
        >
          <div className="rev-left-content">
            <img src={wv1} alt="Wave" />
            <button className="rev-btn">More</button>
            <img src={wv1} alt="Wave" />
          </div>
        </div>
        <div
          className="rev-right"
          data-aos="slide-up"
          data-aos-delay="100"
        >
          {reviewers.slice(2).map((e, index) => (
            <HeadLineCard key={index} content={e} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
