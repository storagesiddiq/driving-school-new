import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allCourses, Error, getAllCourses, Status } from '../../slices/commonSlice';
import { Star } from 'react-feather';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const courses = useSelector(allCourses);
  const navigate = useNavigate()
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

  const loadMoreCourses = useCallback(() => {
    if (!hasMore || status === 'loading' || loading) return;

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
  }, [courses, visibleCourses, hasMore, loading, status]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
      return;
    }
    loadMoreCourses();
  }, [loadMoreCourses, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  console.log(visibleCourses);
  
  return (
    <div className="h-screen container mx-auto">
      <h2 className="text-2xl font-bold mt-20 mb-6">All Courses</h2>

      {status === 'loading' && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCourses.map(course => (
          <div onClick={()=>navigate(`/course/${course._id}`)} key={course._id} className="hover:cursor-pointer border p-4 rounded shadow">
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
