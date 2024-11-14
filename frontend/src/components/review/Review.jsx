import React from "react";
import icon from "./tr-bg.png";
import "./review.css";

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

const HeadLineCard = ({content}) => {
  return (
    <div className="rev-headline-card shadow-sm">
      <div className="rev-head">
        <div className="rev-content">
          <img src={content.ig}/>
          <h3 className="rev-headline">{content.heading}</h3>
        </div>
        <p className="subtitle">{content.name}</p>
      </div>
      <div className="rev-bottom mt-2">
        <p className="rev-content">
          <span className="subtitle para">
            {content.desc}
          </span>
        </p>
      </div>
    </div>
  );
};
const Stats = ({stat}) => {
  return (
    <>
      <div className="stats">
        <h2>{stat.st}</h2>
        <p>{stat.info}</p>
      </div>
    </>
  );
};


const ReviewCard = () => {
  return (
    <>
      <div className="review-card">
        <div className="circle">
          <img src={icon} alt="" className="icon" />
        </div>
        {statistic.map((e,index) => <Stats key={index} stat={e}/>)}
      </div>
    </>
  );
};

const Review = () => {
  return (
    <>
      <div className="container-fluid review">
        <div className="rev-top-view">
          <div className="rev-left">
          {reviewers.slice(0,2).map((e,index) => <HeadLineCard key={index} content={e}/>)}
          </div>
          <div className="rev-right">
            <h1 className="rev-heading-text">
              Review <span className="transparent"> you </span> all shared
            </h1>
            <ReviewCard />
          </div>
        </div>
        <div className="rev-bottom-view">
          <div className="rev-left">
            <div className="rev-left-content">
            <button className="rev-btn">More</button>
            </div>
          </div>
          <div className="rev-right">
            {reviewers.slice(2).map((e,index) => <HeadLineCard key={index} content={e}/>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
