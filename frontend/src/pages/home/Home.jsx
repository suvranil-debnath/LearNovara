import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FiSearch } from "react-icons/fi";
import introImage from './intro-image.png'; // Assuming you have the image
import Typed from 'typed.js';
import Faq from '../../components/FAQ/Faq'
import Footer from '../../components/footer/Footer'
import Course from '../../components/ccourses/Course'
import Course from '../../components/review/Review'

const Home = () => {
      // Create reference to store the DOM element containing the animation
      const el = React.useRef(null);

      React.useEffect(() => {
          const typed = new Typed(el.current, {
          strings: ['<h2>Hi! Welcome to <span>L</span>ear<span>N</span>ovara</h2>'],
          typeSpeed: 50,
          });
  
          return () => {
          // Destroy Typed instance during cleanup to stop animation
          typed.destroy();
          };
      }, []);
  
  const navigate = useNavigate();
  return (<>
    <div className='row bar' >
    <div className="col-lg-5 col-md-9 col-sm-12 search-bar">
        <input type="text" placeholder="Search Courses" />
        <button type="submit"><FiSearch className='search-icon'/></button>
    </div>
    </div>
    <div className="row intro-section">
        <div className="col-lg-5 col-md-7 col-sm-12 intro-text">
            <h3 ref={el}></h3>
        </div>
        
        <div className="col-lg-7 col-md-12 col-sm-12 intro-image">
            <img src={introImage} alt="Intro" />
        </div>
    </div>
    <Course/>
    <Review/>
    <Faq/>
    <Footer/>
    </>
    );
};

export default Home;
