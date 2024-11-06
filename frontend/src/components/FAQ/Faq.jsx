import React from "react";
import plantImage from "./plant-image.png";
import './faq.css';

const qnas = [{q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"},
            {q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"},
            {q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"},
            {q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"},
            {q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"},
            {q:"Q1. What is The question ?",a:"Yor know my ans how much i can cda adas d asda dasdadad asd adasdasd  adsdadafd d fd sfsd fsd fsd sd a dafgds gsgsdgsdgsgsg sgsgs"}
]


const Faq = () => {
    return (
            <div className="container-fluid">
                <div className="row faq">
                {/* Left Column */}
                <div className="col-lg-4 col-md-5 col-sm-12 faq-left">
                    <h1 className="faq-title">
                    Frequently <br />
                    <span className="asked">Asked</span> <br />
                    Questions
                    </h1>
                    <div className="faq-illustration">
                    <img src={plantImage} alt="Plant illustration" />
                    </div>
                </div>
    
                {/* middle Column */}
                <div className="col-lg-8 col-md-5 col-sm-12 qnas" >
                    {qnas.map((qna,index)=>(
                    <div className="qna" key={index}>
                    <h4>{qna.q}</h4>
                    <p>{qna.a}</p>
                    </div>
                    ))}
            </div>
        </div>
    </div>
)};

export default Faq;
