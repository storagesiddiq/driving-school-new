import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allInstructors, Error, getAllInstructors, Status } from '../../slices/commonSlice';
import { useNavigate } from 'react-router-dom';

const InstructorsPage = () => {
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const instructors = useSelector(allInstructors);
  const navigate = useNavigate();
  const [visibleInstructors, setVisibleInstructors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const instructorsPerPage = 10;

  useEffect(() => {
    dispatch(getAllInstructors()); // Fetch all instructors
  }, [dispatch]);

  useEffect(() => {
    if (instructors.length > 0) {
      setVisibleInstructors(instructors.slice(0, instructorsPerPage));
    }
  }, [instructors]);

  const loadMoreInstructors = useCallback(() => {
    if (!hasMore || status === 'loading' || loading) return;

    const nextPageInstructors = instructors.slice(
      visibleInstructors.length,
      visibleInstructors.length + instructorsPerPage
    );

    if (nextPageInstructors.length === 0) {
      setHasMore(false);
    } else {
      setLoading(true);
      setTimeout(() => {
        setVisibleInstructors(prevInstructors => [...prevInstructors, ...nextPageInstructors]);
        setLoading(false);
        setCurrentPage(prevPage => prevPage + 1);
      }, 1000); // Simulate loading delay
    }
  }, [instructors, visibleInstructors, hasMore, loading, status]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    loadMoreInstructors();
  }, [loadMoreInstructors, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-screen container mx-auto">
      <h2 className="text-2xl font-bold mt-20 mb-6">All Instructors</h2>

      {status === 'loading' && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleInstructors.map(instructor => (
          <div
            onClick={() => navigate(`/instructor/${instructor?.instructor._id}`)}
            key={instructor?.instructor._id}
            className="hover:cursor-pointer border p-4 rounded shadow"
          >
            <img
              src={instructor?.instructor.avatar}
              alt={instructor?.instructor.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="mt-2 text-xl font-semibold">{instructor?.instructor.name}</h3>
            <p>Email: {instructor?.instructor.email}</p>
            <p>Experience:_ {instructor.experience} years</p>
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
          You have seen all the instructors.
        </div>
      )}
    </div>
  );
};

export default InstructorsPage;
