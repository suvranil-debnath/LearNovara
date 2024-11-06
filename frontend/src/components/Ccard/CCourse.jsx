import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay,Pagination, EffectCoverflow,Navigation } from 'swiper/modules';

import './Course.css';
import { CourseData } from "../../context/CourseContext";
import Ccard from './Ccard'

const Course = () => {
  const { courses } = CourseData();
  return (
    <>
    {/* Above the course slide */}
    {/* <div className="container-fluid">
          <div className="row">

            <div className="col-lg-3 col-md-6 col-sm-2 filters">
                <label><h4>Professional Courses</h4></label>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-2 filters">

                  <label>
                    <input type="checkbox" /> Free Courses
                  </label>
            </div>

            <div className="col-lg-2 col-md-6 col-sm-2 filters">
              <label>
                <input type="checkbox" /> Paid Courses
              </label>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-2 filters">
                      <label>

                      <select className="dropdown_content" name="age_value">
                          <option value="Sort">Sort</option>
                          <option value="Popularity">Popularity</option>
                          <option value="low to High">Price- low to High</option>
                          <option value="High to low">Price- High to low</option>
                      </select>
                      </label>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-4 filters">
                  <div className='popular-courses'>
                    <h1 className="popular-courses">Popular Courses</h1>
                  </div>
            </div>
            </div>
          </div> */}

{/* course slide  */}

      <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          effect={'coverflow'}
          grabCursor={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 2,
            depth: 0,
            modifier: 0,
            slideShadows: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation,EffectCoverflow]}
          className="mySwiper"
        >
        <div className='courses'>
            {courses.map((e) => <Ccard key={e._id} course={e}/>)}
        </div>
      </Swiper>
    </>
  )
}
export default Course