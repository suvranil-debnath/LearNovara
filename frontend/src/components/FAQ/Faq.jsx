import React, { useState, useEffect } from "react";
import plantImage from "./plant-image.png";
import './faq.css';
import { server } from "../../main";
import Groq from "groq-sdk";
import axios from 'axios';
import AOS from 'aos';
import "aos/dist/aos.css";

const Faq = () => {
    const [allQnas, setAllQnas] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 1200,
            once: true,
            easing: "ease-out",
        });
    }, []);

    const groq = new Groq({
        apiKey: "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",
        dangerouslyAllowBrowser: true,
    });

    const fetchAIAnswer = async (userQuestion) => {
        setLoading(true);
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: "user", content: `${userQuestion}. Max 200 words , always give compact ans with rich information , do not give any points or break down give only single paragraph.` }],
                model: "llama3-8b-8192",
            });
            return chatCompletion.choices[0]?.message?.content || "No answer available.";
        } catch (error) {
            console.error("Error fetching AI answer:", error);
            return "Unable to retrieve the answer.";
        } finally {
            setLoading(false);
        }
    };

    const fetchQnAsFromDatabase = async () => {
        try {
            const response = await axios.get(`${server}/api/faqs`);
            setAllQnas(response.data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };

    useEffect(() => {
        fetchQnAsFromDatabase();
    }, []);

    const handleAddQuestion = async () => {
        if (question.trim()) {
            const aiAnswer = await fetchAIAnswer(question);
            const newQna = { question, answer: aiAnswer };

            try {
                await axios.post(`${server}/api/faqs`, newQna);
                setAllQnas((prevQnas) => [...prevQnas, newQna]);
                setQuestion("");
            } catch (error) {
                console.error("Error saving FAQ:", error);
            }
        }
    };

    const toggleExpanded = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            {/* Header Section */}
            <div className="faq-header">
                <div className="faq-header-content" data-aos="fade-right">
                    <h1>
                        Got <span>Questions?</span> <br />
                        We've Got Answers.
                    </h1>
                    <p>Your common questions answered with AI-driven insights!</p>
                </div>
                <div className="faq-header-image" data-aos="fade-left">
                    <img src={plantImage} alt="FAQ Illustration" />
                </div>
            </div>

            {/* FAQ Content */}
            <div className="faq-content">
                {allQnas.map((qna, index) => (
                    <div className="faq-item" key={index} data-aos="fade-up">
                        <div className="faq-question">
                            <h4>Q{index + 1}. {qna.question}</h4>
                        </div>
                        <div className={`faq-answer ${expandedIndex === index ? "expanded" : ""}`}>
                            <p>
                                {expandedIndex === index
                                    ? qna.answer
                                    : `${qna.answer.substring(0, 200)}...`}
                            </p>
                            <button onClick={() => toggleExpanded(index)}>
                                {expandedIndex === index ? "Show Less" : "Read More"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ask a Question */}
            <div className="faq-ask" data-aos="fade">
                <h2>Have a question? Ask now!</h2>
                <div className="faq-ask-input-group">
                    <input
                        type="text"
                        placeholder="Type your question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        onClick={handleAddQuestion}
                        disabled={loading}
                        className="faq-submit"
                    >
                        {loading ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Faq;
