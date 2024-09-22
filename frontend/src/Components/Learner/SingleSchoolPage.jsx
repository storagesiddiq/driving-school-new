import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Error, getSingleSchool, singleSchool, Status } from '../../slices/commonSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Star } from 'react-feather';

const SingleSchoolPage = () => {
  const dispatch = useDispatch();
  const school = useSelector(singleSchool);
  const status = useSelector(Status);
  const error = useSelector(Error);
  const { id } = useParams();
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('instructors'); // Default to 'instructors'

  useEffect(() => {
    dispatch(getSingleSchool(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full ">
      {/* Upper Section: Banner and Avatar */}
      <div className="relative h-64 md:h-80 w-full">
        <img
          src={school?.drivingSchool?.bannerImg}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 md:left-10 transform translate-y-1/2 flex items-center">
          <img
            src={school?.drivingSchool?.avatar}
            alt="Owner Avatar"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white"
          />
          <div className="ml-4 text-white bg-gray-900 p-2 rounded-md">
            <h2 className="text-2xl font-bold">{school?.drivingSchool?.drivingSchoolName}</h2>
            <p>{school?.drivingSchool?.location}</p>
          </div>
        </div>
      </div>

      {/* Tab Buttons for Instructors and Courses */}
      <div className="flex justify-center mt-12">
        <button
          onClick={() => setActiveTab('instructors')}
          className={`px-6 py-2 mx-2 rounded-md text-white ${
            activeTab === 'instructors' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          Instructors
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-6 py-2 mx-2 rounded-md text-white ${
            activeTab === 'courses' ? 'bg-blue-600' : 'bg-gray-400'
          }`}
        >
          Courses
        </button>
      </div>

      {/* Instructors List */}
      {activeTab === 'instructors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {school?.Instructors?.map((instructor) => (
            <div key={instructor.instructor._id} className="flex gap-2 items-center border p-4 rounded shadow">
              <img
                src={instructor?.instructor.avatar}
                alt={instructor?.instructor.name}
                className="w-16 h-16 rounded-full "
              />
             <div>  <h3 className="text-xl font-semibold">{instructor?.instructor.name}</h3>
              <p>Email: {instructor?.instructor.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Courses List */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {school?.course?.map((course) => (
            <div onClick={()=>{navigate(`/course/${course._id}`)}} key={course._id} className="hover-cursor:pointer border rounded shadow">
             <img
              src={course?.image}
              className="hover-cursor:pointer rounded-md border"
              style={{ objectFit: 'cover', display: 'block', height: '150px', width: '100%' }}
              alt="Course Avatar"
            /> <div className='hover-cursor:pointer p-2'> 
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="font-semibold text-xs mt-2"> ₹{course.price}</p>
              {course.ratings > 0 && (
              <div className="flex items-center text-yellow-500 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < course.ratings ? 'fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-gray-500">({course.ratings})</span>
              </div>
            )}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSchoolPage;
