import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const { isAuth } = UserData();
  const [loading, setLoading] = useState(false);
  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();



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


  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  useEffect(() => {
    fetchLectures();
  }, []);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const {
      data: { order },
    } = await axios.post(
      `${server}/api/course/checkout/${params.id}`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    const options = {
      key: "rzp_test_glhF13Fdod0C1P",
      amount: order.id,
      currency: "INR",
      name: "E learning",
      description: "Learn with us",
      order_id: order.id,

      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        try {
          const { data } = await axios.post(
            `${server}/api/verification/${params.id}`,
            { razorpay_order_id, razorpay_payment_id, razorpay_signature },
            { headers: { token } }
          );

          await fetchUser();
          await fetchCourses();
          await fetchMyCourse();
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
      theme: { color: "teal" },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  const isGoogleDriveLink = course.image && course.image.includes("drive.google.com");

  return (
    <div className="wrap">
      {loading ? (
        <Loading />
      ) : (
        <div className="course-description">
          {course && (
            <>
              <div className="course-header">
                <div className="course-thumbnail">
                  <img
                   src={isGoogleDriveLink ? course.image : `${server}/${course.image}`} 
                    alt="Course Thumbnail"
                    className="course-image"
                  />
                  <div className="badge">Popular</div>
                  <p className="duration">{course.duration} weeks</p>
                </div>

                <div className="sd-btn">
            </div>

                <div className="course-details">
                  <h2>{course.title}</h2> {isAuth ? (
                    <>
                      {user && user.role !== "admin" ? (
                        <>
                          {user.subscription.includes(course._id) ? (
                            <button
                              onClick={() => navigate(`/lectures/${course._id}`)}
                              className="cd-button"
                            >
                              Study
                            </button>
                          ) : (
                            <button onClick={checkoutHandler} className="cd-button">
                                Enroll Now
                              </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/lectures/${course._id}`)}
                          className="cd-button"
                        >
                          Study
                        </button>
                      )}
                    </>
                  ) : (
                    <button onClick={() => navigate("/login")} className="cd-button">
                      LogIn
                    </button>
                  )}
                  
{/* 
                  <div className="rating">
                    <span>★★★★☆</span> <span>(43,435)</span>
                  </div> */}

                 
                  



                </div>
                <div className="course-meta">
                    <span>Creator: {course.createdBy}</span><br/>
                    <span>Duration: {course.duration} weeks</span>
                  </div>
              </div>

              <div className="course-content">
                <h3>Details</h3>
                <p>{course.description}</p>
                <h3>Lessons</h3>
                <div className="lesson-list">
                {lectures && lectures.length > 0 ? (
                lectures.map((e, i) => (
                    <div key={i} className="lesson-item">
                      <h4>Lesson {i + 1}: {e.title}{" "}</h4>
                      <p>{e.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No Lectures Yet!</p>
                )}
                </div>




                <h3>Write A Review</h3>
                <textarea placeholder="Type something..." />
                <button className="submit-review">Submit Review</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDescription;
