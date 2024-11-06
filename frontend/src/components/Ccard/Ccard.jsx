import React from "react";
import "./Course.css";
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";


const Ccard = ({course}) =>{
    const navigate = useNavigate();
    const { user, isAuth } = UserData();

    const { fetchCourses } = CourseData();

    const deleteHandler = async (id) => {
        if (confirm("Are you sure you want to delete this course")) {
        try {
            const { data } = await axios.delete(`${server}/api/course/${id}`, {
            headers: {
                token: localStorage.getItem("token"),
            },
            });

            toast.success(data.message);
            fetchCourses();
        } catch (error) {
            toast.error(error.response.data.message);
        }
        }
    };
    return(
        <>
        <div key={course.id} className="course_card_slide">
            <SwiperSlide>
            <div className="course_card">
                    <div className='image-content'>
                        <div className='overlay'>
                            <div className='card-image'>
                                <img src={`${server}/${course.image}`} alt="course img" className='card-img'></img>
                            </div>
                        </div>
                    </div>

                    <div className='card-content'>
                        <span className="name">{course.title}</span>
                        <span className='subname'>{course.createdBy}</span>
                        <span className='description'>{course.duration}</span>
                        <hr></hr>
                        <span className='subname'>₹{course.price}</span>
                        {/* <div className="buttonTag">
                            {course.tags.map((tag, index) => (
                                <span key={index} className="button">{tag}</span>
                            ))}
                        </div> */}
                        <div className='buttonside'>
                        {isAuth ? (
                        <>
                            {user && user.role !== "admin" ? (
                                <>
                                {user.subscription.includes(course._id) ? (
                                    <button
                                    onClick={() => navigate(`/course/study/${course._id}`)}
                                    className="buttonSide"
                                    >
                                    Study
                                    </button>
                                ) : (
                                    <button
                                    onClick={() => navigate(`/course/${course._id}`)}
                                    className="buttonSide"
                                    >
                                    Get Started
                                    </button>
                                )}
                                </>
                            ) : (
                                <button
                                onClick={() => navigate(`/course/study/${course._id}`)}
                                className="buttonSide"
                                >
                                Study
                                </button>
                            )}
                            </>
                        ) : (
                            <button onClick={() => navigate("/login")} className="buttonSide">
                            Get Started
                            </button>
                        )}

                        <br />

                        {user && user.role === "admin" && (
                            <button
                            onClick={() => deleteHandler(course._id)}
                            className="buttonSide"
                            style={{ background: "red" }}
                            >
                            Delete
                            </button>
                        )}

                    </div>
                </div>
            </div>
            </SwiperSlide>
            </div>
        </>
    )
}

export default Ccard;