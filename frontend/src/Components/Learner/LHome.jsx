import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allCourses, Error, getAllCourses, Status } from '../../slices/commonSlice';
import { Star } from 'react-feather';
import { FaArrowRight } from "react-icons/fa6";

const LHome = () => {
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const courses = useSelector(allCourses);
  const navigate = useNavigate();

  const [visibleCourses, setVisibleCourses] = useState([]);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses.length > 0) {
      setVisibleCourses(courses.slice(0, 3)); // Show initial 3 courses
    }
  }, [courses]);

  const goToCoursesPage = () => {
    navigate('/courses'); // Redirect to courses page on arrow click
  };

  return (
    <div className="mt-20 h-screen container relative">
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-bold">All Courses</h2>
        <button onClick={goToCoursesPage} className="text-3xl bg-gray-200 rounded-lg p-2">
        <FaArrowRight size={25}/>
        </button>
      </div>

      {status === 'loading' && (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded-md"></div>
          <div className="h-6 bg-gray-200 rounded-md"></div>
          <div className="h-4 bg-gray-200 rounded-md"></div>
        </div>
      )}

      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'succeeded' && visibleCourses.map(course => (
          <div onClick={()=>navigate(`/course/${course._id}`)} key={course._id} className="hover:cursor-pointer border p-4 rounded shadow">

            <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <p className="mt-2 font-bold">₹{course.price}</p>
            {course.ratings > 0 && (
              <div className="flex items-center text-yellow-500 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < course.ratings ? 'fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-gray-500">({course.ratings})</span>
              </div>
            )}
          </div>
        ))}
      </div>




    </div>
  );
};

export default LHome;
