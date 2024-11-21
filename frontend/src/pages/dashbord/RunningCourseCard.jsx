import React, { useEffect,useState} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./runningCourseCard.css";
import { server } from "../../main";
import { useNavigate  , useParams} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const RunningCourseCard = ({ course }) => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
    
    const [completed, setCompleted] = useState(0);
    const [completedLec, setCompletedLec] = useState(0);
    const [lectLength, setLectLength] = useState(0);

    const [lecList, setLecList] = useState([]);

    const fetchProgress = async () => {
        try {
            const courseId = course._id;   
            const { data } = await axios.get(`${server}/api/progress/${courseId}`);
        
        setCompleted(data.courseProgressPercentage);
        setCompletedLec(data.completedLectures);
        setLectLength(data.allLecturesCount);
        setLecList(data.lecTitles)
    } catch (error) {
        console.error("Error fetching progress:", error);
    }
    };
    

    useEffect(() => {
        fetchProgress();
    }, []);

    return (
        <div className="runningcourse-card">
            <div className="runningcourse-card-left">
            <h4>COURSE</h4>
            <h2>{course.title}</h2>
            <p>By - {course.createdBy}</p>
            <a href="#view-all-chapters" className="runningcourse-view-link">
                View all chapters &gt;
            </a>
            </div>
            <div className="runningcourse-card-right">
            <div>
            <h5>LECTURE {completedLec}</h5>
            <h3>{lecList[completedLec]}</h3>
            <div className="runningcourse-progress-bar">
                <div
                className="runningcourse-progress"
                style={{ width: `${completed}%` }}
                ></div>
            </div>
            <span className="runningcourse-challenge-text">{completedLec}/{lectLength} complete</span>
            </div>
            <button className="runningcourse-continue-button">Continue</button>
            </div>
        </div>
    );
};

export default RunningCourseCard;
