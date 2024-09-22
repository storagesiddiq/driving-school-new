import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { allCourses, allInstructors, allSchools, Error, getAllCourses, getAllInstructors, getAllSchools, Status } from '../../slices/commonSlice';
import { Star } from 'react-feather';
import { FaArrowRight } from "react-icons/fa6";
import { IsUpdate, allCourses as MyCourses, Status as LearnStatus, clearUpdated, } from '../../slices/learnerSlice';
import { applyCourse, getMyCourses } from '../../slices/learnerSlice';

const LHome = () => {
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const courses = useSelector(allCourses);
  const schools = useSelector(allSchools)
  const instructors = useSelector(allInstructors)
  const myCourses = useSelector(MyCourses);
  const isUpdate = useSelector(IsUpdate);
  const learnStatus = useSelector(LearnStatus);

  const navigate = useNavigate();

  const [visibleCourses, setVisibleCourses] = useState([]);

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getAllSchools());
    dispatch(getAllInstructors());
  }, [dispatch]);

  useEffect(() => {
    if (courses.length > 0) {
      setVisibleCourses(courses.slice(0, 3)); // Show initial 3 courses
    }
  }, [courses]);

  const goToCoursesPage = () => {
    navigate('/courses'); 
  };

  const goToSchoolsPage = () => {
    navigate('/schools'); 
  };
  
  const goToInstructorPage = ()=>{
    navigate('/instructors'); 
  }

  const handleApplyCourse = (id) => {
    dispatch(applyCourse({ courseId: id }));
  };

  useEffect(() => {
    dispatch(getMyCourses());
    if(isUpdate){
      dispatch(clearUpdated())
    }
  }, [isUpdate,dispatch]);


  const isCourseApplied = (courseId) => {
    return myCourses?.pendingCourse?.some(course => course.course?._id === courseId);
  };

  const isCourseApproved = (courseId) => {
    return myCourses?.approvedCourse?.some(course => course.course?._id === courseId);
  };

  const isCourseRejected = (courseId) => {
    return myCourses?.rejectedCourse?.some(course => course.course?._id === courseId);
  };

  return (
    <div className="mt-20 min-h-screen container relative">
      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-bold">All Courses</h2>
        <button onClick={goToCoursesPage} className="text-3xl bg-gray-200 rounded-full p-2">
        <FaArrowRight  size={20}/>
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

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'succeeded' && visibleCourses.map(course => (
          <div onClick={()=>navigate(`/course/${course._id}`)} key={course._id} className="flex flex-col justify-between hover:cursor-pointer border  rounded shadow">
    <img
              src={course?.image}
              className="rounded-md border"
              style={{ objectFit: 'cover', display: 'block', height: '150px', width: '100%' }}
              alt="Course Avatar"
            />
           <div className='p-2'>  <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApplyCourse(course._id);
              }}
              disabled={isCourseApplied(course._id) ||  isCourseApproved(course._id) || isCourseRejected(course._id)  || learnStatus === "loading"}
              className={`mt-2 w-full font-semibold py-2 text-white text-center rounded-md ${isCourseApplied(course._id) ? 'bg-blue-400' : isCourseApproved(course._id) ? 'bg-green-500' :  isCourseRejected(course._id) ? 'bg-red-500' : 'bg-primary-dark'}`}
            >
              {learnStatus === "loading" && !isCourseApplied(course._id) ? (
                <Spinner />
              ) : isCourseApplied(course._id) ? (
                'APPLIED'
              ) : 
              isCourseApproved(course._id) ? (
                'APPROVED'
              ) : 
              isCourseRejected(course._id) ? (
                'REJECTED'
              ) :
              (
                'APPLY'
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-bold">All Driving Schools</h2>
        <button onClick={goToSchoolsPage} className="text-3xl bg-gray-200 rounded-full p-2">
        <FaArrowRight  size={20}/>
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'succeeded' && schools.slice(0,3).map(school => (
          <div onClick={()=>navigate(`/school/${school._id}`)} key={school._id} className="flex gap-2 item-center hover:cursor-pointer border p-4 rounded shadow">
         <img src={school.avatar} alt={school.drivingSchoolName} className="w-12 h-12 rounded-full"/>
          <div>   
            <h3 className="text-xl font-semibold">{school.drivingSchoolName}</h3>
            <p  className="text-xs text-gray-500">{school.location}</p>
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-between items-center mt-4">
        <h2 className="text-2xl font-bold">All Instructors</h2>
        <button onClick={goToInstructorPage} className="text-3xl bg-gray-200 rounded-full p-2">
        <FaArrowRight  size={20}/>
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {status === 'succeeded' && instructors.slice(0,3).map(inst => (
          <div onClick={()=>navigate(`/instructor/${inst._id}`)} key={inst._id} className="flex gap-2 item-center hover:cursor-pointer border p-4 rounded shadow">
         <img src={inst?.instructor.avatar} alt={inst?.instructor.name} className="w-12 h-12 rounded-full"/>
          <div>   
            <h3 className="text-xl font-semibold">{inst?.instructor.name}</h3>
            <p  className="text-xs text-gray-500">{inst?.instructor.email}</p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default LHome;
