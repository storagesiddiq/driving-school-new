import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  allSchools, Error,  getAllSchools, Status } from '../../slices/commonSlice';
import { useNavigate } from 'react-router-dom';

const SchoolsPage = () => {
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const error = useSelector(Error);
    const schools = useSelector(allSchools);
    const navigate = useNavigate()
    const [visibleSchools, setVisibleSchools] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const schoolsPerPage = 10;

    useEffect(() => {
        dispatch(getAllSchools()); // Fetch all courses
    }, [dispatch]);

    useEffect(() => {
        if (schools.length > 0) {
            setVisibleSchools(schools.slice(0, schoolsPerPage));
        }
    }, [schools]);

    const loadMoreSchools = useCallback(() => {
        if (!hasMore || status === 'loading' || loading) return;

        const nextPageSchools = schools.slice(visibleSchools.length, visibleSchools.length + schoolsPerPage);

        if (nextPageSchools.length === 0) {
            setHasMore(false);
        } else {
            setLoading(true);
            setTimeout(() => {
                setVisibleSchools(prevSchools => [...prevSchools, ...nextPageSchools]);
                setLoading(false);
                setCurrentPage(prevPage => prevPage + 1);
            }, 1000); // Simulate loading delay
        }
    }, [schools, visibleSchools, hasMore, loading, status]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) {
            return;
        }
        loadMoreSchools();
    }, [loadMoreSchools, hasMore, loading]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    console.log(visibleSchools);

    return (
        <div className="h-screen container mx-auto">
            <h2 className="text-2xl font-bold mt-20 mb-6">All Driving Schools</h2>

            {status === 'loading' && <div>Loading...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleSchools.map(school => (
                    <div onClick={() => navigate(`/school/${school._id}`)} key={school._id} className="flex gap-2 item-center hover:cursor-pointer border p-4 rounded shadow">
                        <img src={school.avatar} alt={school.drivingSchoolName} className="w-12 h-12 rounded-full" />
                        <div>
                            <h3 className="text-xl font-semibold">{school.drivingSchoolName}</h3>
                            <p className="text-xs text-gray-500">{school.location}</p>
                        </div>
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
                    You have seen all the schools.
                </div>
            )}
        </div>
    );
};

export default SchoolsPage;
