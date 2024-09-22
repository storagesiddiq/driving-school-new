import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allCourses, Error, getAllCourses, Status } from '../../slices/commonSlice';
import { clearUpdated, IsUpdate, Status as LearnStatus, allCourses as MyCourses } from '../../slices/learnerSlice';
import { Star } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { applyCourse, getMyCourses } from '../../slices/learnerSlice';
import Spinner from '../../utils/Spinner';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(Status);
  const error = useSelector(Error);
  const courses = useSelector(allCourses);
  const myCourses = useSelector(MyCourses);
  const isUpdate = useSelector(IsUpdate);
  const learnStatus = useSelector(LearnStatus);

  const [visibleCourses, setVisibleCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const coursesPerPage = 10;

  useEffect(() => {
    dispatch(getAllCourses()); // Fetch all courses
  }, [dispatch]);

  useEffect(() => {
    if (courses.length > 0) {
      setVisibleCourses(courses.slice(0, coursesPerPage));
    }
  }, [courses]);

  useEffect(() => {
    dispatch(getMyCourses());
    if (isUpdate) {
      dispatch(clearUpdated())
    }
  }, [isUpdate, dispatch]);

  const loadMoreCourses = useCallback(() => {
    if (loading || !hasMore) return; // Prevent loading if already in progress or no more courses

    const nextPageCourses = courses.slice(visibleCourses.length, visibleCourses.length + coursesPerPage);

    if (nextPageCourses.length === 0) {
      setHasMore(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        setVisibleCourses(prevCourses => [...prevCourses, ...nextPageCourses]);
        setLoading(false);
        setCurrentPage(prevPage => prevPage + 1);
      }, 1000); // Simulate loading delay
    }
  }, [courses, visibleCourses, hasMore, loading]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 10) {
      loadMoreCourses();
    }
  }, [loadMoreCourses]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleApplyCourse = (id) => {
    dispatch(applyCourse({ courseId: id }));
  };

  // Check if the course is already applied for
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
    <div className="container mx-auto min-h-screen p-6">
      <h2 className="text-2xl font-bold mt-20 mb-6">All Courses</h2>

      {status === 'loading' && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCourses.map(course => (
          <div
            onClick={() => navigate(`/course/${course._id}`)}
            key={course._id}
            className="flex flex-col justify-between hover:cursor-pointer borderrounded shadow"
          >
            <img
              src={course?.image}
              className="rounded-md border"
              style={{ objectFit: 'cover', display: 'block', height: '150px', width: '100%' }}
              alt="Course Avatar"
            />
            <div className='p-2'>

              <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
              <p>{course.description}</p>
              <p className="font-bold">₹{course.price}</p>
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
              disabled={isCourseApplied(course._id) || isCourseApproved(course._id) || isCourseRejected(course._id) || learnStatus === "loading"}
              className={`mt-2 w-full font-semibold py-2 text-white text-center rounded-md ${isCourseApplied(course._id) ? 'bg-blue-400' : isCourseApproved(course._id) ? 'bg-green-500' : isCourseRejected(course._id) ? 'bg-red-500' : 'bg-primary-dark'}`}
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

      {/* Infinite Scroll Loader */}
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="loader">Loading...</div>
        </div>
      )}

      {!hasMore && (
        <div className="text-center mt-8 text-gray-500">
          You have seen all the courses.
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
