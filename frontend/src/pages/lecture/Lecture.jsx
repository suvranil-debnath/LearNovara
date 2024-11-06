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

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);

      // Fetch the transcript for the selected lecture
      fetchTranscript(getYouTubeID(data.lecture.video));
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  async function fetchTranscript(videoId) {
    try {
      const { data } = await axios.get(`${server}/api/transcript/${videoId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture((prev) => ({ ...prev, transcript: data.transcript }));
    } catch (error) {
      console.log("Error fetching transcript:", error);
      setLecture((prev) => ({ ...prev, transcript: "Transcript not available." }));
    }
  }

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
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
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures);
      setLectLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {
      console.log(error);
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      fetchProgress();
    } catch (error) {
      console.log(error);
    }
  };

  const getYouTubeID = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);

  const videoOptions = {
    height: '500',
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  const onVideoEnd = () => {
    addProgress(lecture._id);
  };

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
              {user && user.role === "admin" && (
                <button onClick={() => setShow(!show)}>
                  {show ? "Close" : "Add Lecture +"}
                </button>
              )}

              {show && (
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
                <h3>Group Chat</h3>
                <div className="chat-box">
                </div>
                <div className="input-container">
                  <input type="text" placeholder="Type a message..." />
                  <button className="send-button">
                    <FaPaperPlane />
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
