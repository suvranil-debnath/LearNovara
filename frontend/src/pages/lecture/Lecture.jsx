import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import YouTube from "react-youtube";
import Collapsible from 'react-collapsible';
import { Innertube } from "youtubei.js/web";
import Groq from "groq-sdk";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [completedLec, setCompletedLec] = useState(0);
  const [lectLength, setLectLength] = useState(0);
  const [progress, setProgress] = useState([]);
  const [allQnas, setAllQnas] = useState([]);
  const [question, setQuestion] = useState("");
  const [isFetchingAnswer, setIsFetchingAnswer] = useState(false);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");
//LLM C
  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      toast.error("Failed to fetch lectures.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLecture = async (id) => {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);

      // Fetch transcript for the lecture
      await fetchTranscript(getYouTubeID(data.lecture.video));
    } catch (error) {
      console.error("Error fetching lecture:", error);
      toast.error("Failed to fetch lecture.");
    } finally {
      setLecLoading(false);
    }
  };


  const fetchTranscript = async (url) => {
    try {
      const response = await axios.get(`${server}/api/transcript/youtube-proxy`, {
        params: { url },  // Send the videoId as a query parameter
      });
      setLecture((prev) => ({ ...prev, transcript: response.data.transcript }));
    } catch (error) {
      console.error("Error fetching transcript:", error);
      setLecture((prev) => ({ ...prev, transcript: "Transcript not available." }));
    }
  };
  




  const fetchAIAnswer = async (userQuestion) => {
    setIsFetchingAnswer(true);
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: userQuestion }],
        model: "llama3-8b-8192",
      });

      return chatCompletion.choices[0]?.message?.content || "No answer available.";
    } catch (error) {
      console.error("Error fetching AI answer:", error);
      return "An error occurred while fetching the answer.";
    } finally {
      setIsFetchingAnswer(false);
    }
  };

  const handleAddQuestion = async () => {
    if (question.trim()) {
      const transcript = lecture.transcript || "";
      const userQuestion = `${transcript}\nQuestion: ${question}`;
      const aiAnswer = await fetchAIAnswer(userQuestion);
      setAllQnas([...allQnas, { q: question, a: aiAnswer }]);
      setQuestion("");
    } else {
      toast.error("Please enter a valid question.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("video", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture.");
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });
        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete lecture.");
      }
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/progress?course=${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const addProgress = async (id) => {
    try {
      await axios.post(`${server}/api/user/progress?course=${params.id}&lectureId=${id}`, {}, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      fetchProgress();
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const getYouTubeID = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&]{11})/);
    return match ? match[1] : null;
  };

  const videoOptions = {
    height: "500",
    width: "100%",
    playerVars: { autoplay: 0 },
  };

  const onVideoEnd = () => addProgress(lecture._id);

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);




  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="progress">
            <p>{completedLec}/{lectLength} complete</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completed}%` }}></div>
            </div>
          </div>

          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : (
                <>
                  {lecture.video ? (
                    <>
                      <YouTube
                        videoId={getYouTubeID(lecture.video)}
                        opts={videoOptions}
                        onEnd={onVideoEnd}
                      />
                      <h1>{lecture.title}</h1>
                      <h3>{lecture.description}</h3>

                      <div className="transcript-section">
                        <h2>Transcript.....</h2>
                        <p>{lecture.transcript || "Transcript not available."}</p>
                      </div>
                    </>
                  ) : (
                    <h1>Please Select a Lecture</h1>
                  )}
                </>
              )}
            </div>

            <div className="right">
              {user && (user.role === "tutor" || user.role === "admin") && (
                <Collapsible trigger={show ? "Close" : "Add Lecture +"} onOpening={() => setShow(true)} onClosing={() => setShow(false)}>
                <div className="lecture-form">
                  <h2>Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="YouTube Video URL"
                      value={video}
                      onChange={(e) => setVideo(e.target.value)}
                      required
                    />
                    <button type="submit" disabled={btnLoading}>
                      {btnLoading ? "Please Wait..." : "Add"}
                    </button>
                  </form>
                </div>
              </Collapsible>
            )}

              <div className="lecture-list-grid">
                {lectures && lectures.length > 0 ? (
                  lectures.map((e, i) => (
                    <div key={i} className={`lecture-number ${lecture._id === e._id && "active"}`} onClick={() => fetchLecture(e._id)}>
                      {i + 1}. {e.title}
                      {progress[0] && progress[0].completedLectures.includes(e._id) && (
                        <span className="completed-icon"><TiTick /></span>
                      )}
                      {user && user.role === "admin" && (
                        <button onClick={() => deleteHandler(e._id)} className="icon-button">
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No Lectures Yet!</p>
                )}
              </div>
              <div className="group-chat">
              <h3>Clear Your Doubts</h3>
              <div className="chat-box">
                {allQnas.map((qna, index) => (
                  <div className="qna" key={index}>
                    <h4>{qna.q}</h4>
                    <p>{qna.a}</p>
                  </div>
                ))}
              </div>
              <div className="input-container">
                <input type="text" placeholder="Enter your question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                <button className="send-button" onClick={handleAddQuestion} disabled={isFetchingAnswer}>
                  {isFetchingAnswer ? "Loading..." : <FaPaperPlane />}
                </button>
              </div>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
