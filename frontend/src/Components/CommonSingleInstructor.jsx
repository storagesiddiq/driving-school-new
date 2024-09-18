import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../utils/Spinner';

import { Star } from 'react-feather'; 
import { Error, getSingleInstructor, singleInstructor, Status } from '../slices/commonSlice';

const CommonSingleInstructor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const instructorData = useSelector(singleInstructor);
 const navigate = useNavigate()

  useEffect(() => {
    dispatch(getSingleInstructor(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  // Destructuring the instructor data
  const { instructor} = instructorData || {};
  const instructorDetails = instructor?.instructor || {}; // Access nested instructor details


  return (
    <div className="container rounded-md bg-gray-200 mx-auto p-2">
      {/* Instructor Details */}
      <div className="bg-white mx-auto p-3">
        <div className="mb-8 text-center">
          <img src={instructorDetails?.avatar} alt="Instructor Avatar" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-2xl font-bold">{instructorDetails?.name}</h2>
          <p className="text-gray-600">{instructorDetails?.email}</p>
        </div>

        <div>
          {instructorData?.instructor?.courses && instructorData?.instructor?.courses.length > 0 && <h1 className="my-2 text-xl font-semibold">Associated Courses</h1>}
          <div>
            {instructorData?.instructor?.courses &&
              instructorData?.instructor?.courses.length > 0
              && instructorData?.instructor.courses.map(course => ( 
                <div onClick={()=>{navigate(`/owner/course/${course._id}`)}} key={course._id} className="hover:cursor-pointer border bg-white p-4 rounded-lg shadow-md mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{course.title}</h4>
                  <p className="text-gray-600">{course.description}</p>
                  <p className="text-gray-500">Duration: {course.duration} Weeks</p>
                  {course.ratings > 0 && (
                    <div className="flex items-center text-yellow-500 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < course.ratings ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-gray-500">({course.ratings})</span>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonSingleInstructor;
