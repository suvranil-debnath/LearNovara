import React from "react";
import { useState , useEffect } from "react";
import plantImage from "./plant-image.png";
import './faq.css';
import { server } from "../../main";
import Groq from "groq-sdk";
import axios from 'axios';




const Faq = () => {
    const [allQnas, setAllQnas] = useState([]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Fetch AI Answer from Groq SDK
    const groq = new Groq({
        apiKey: "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",
        dangerouslyAllowBrowser: true 
    });

    // Fetch AI Answer
    const fetchAIAnswer = async (userQuestion) => {
        setLoading(true);
        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [{ role: "user", content: `${userQuestion} .Maximum Wordlimit 300` }],
                model: "llama3-8b-8192",
            });
            const aiAnswer = chatCompletion.choices[0]?.message?.content || "No answer available.";
            return aiAnswer;
        } catch (error) {
            console.error("Error fetching AI answer:", error);
            return "An error occurred while fetching the answer.";
        } finally {
            setLoading(false);
        }
    };

    // Fetch QnAs from MongoDB on component load
    const fetchQnAsFromDatabase = async () => {
        try {
            const response = await axios.get(`${server}/api/faqs`);
            setAllQnas(response.data); // Assuming the response is an array of QnAs
        } catch (error) {
            console.error("Error fetching FAQs from the server:", error);
        }
    };

    // UseEffect to load initial data
    useEffect(() => {
        fetchQnAsFromDatabase();
    }, []);

    // Handler for adding a new question with AI answer
    const handleAddQuestion = async () => {
        if (question.trim()) {
            const aiAnswer = await fetchAIAnswer(question);
            const newQna = { q: question, a: aiAnswer };

            // Save to MongoDB
            try {
                await axios.post(`${server}/api/faqs`, {
                    question: question,
                    answer: aiAnswer,
                });
                console.log("FAQ saved to the server");

                // Update local state with new QnA
                setAllQnas((prevQnas) => [...prevQnas, newQna]);
                setQuestion("");
            } catch (error) {
                console.error("Error saving FAQ to the server:", error);
            }
        }
    };

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
                {allQnas.map((qna, index) => (
                    <div className="qna" key={index}>
                    <h4>Q{index+1}. {qna.question}</h4>
                    <p>{qna.answer}</p>
                    </div>
                    ))}
                
                <div className="add-question">
                    <h4>Something On Your Mind? Ask here!</h4>
                    <div className="add-quetion-input-btn">
                    <input
                        type="text"
                        placeholder="Enter your question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="question-input"
                        />
                        <button
                            onClick={handleAddQuestion}
                            className="add-question-button"
                            disabled={loading}
                            >
                            {loading ? "Fetching Answer..." : "Ask Us!"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)};

export default Faq;
