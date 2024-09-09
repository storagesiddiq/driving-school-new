import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, getSingleSchool, singleSchool, Status } from '../../slices/adminSlice';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Star } from 'react-feather'; 

const SingleDrivingSchool = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const school = useSelector(singleSchool);

  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    dispatch(getSingleSchool(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const renderCourses = () => (
    <div>
      {school?.courses?.length ? (
        school.courses.map((course) => (
          <div key={course._id} className="border bg-white p-2 rounded-md rounded-lg shadow-md mb-4">
            <h4 className="text-lg font-semibold text-gray-800">{course.title}</h4>
            <p className="text-gray-600">{course.description}</p>
            <p className="text-gray-500">Duration: {course.duration} hours</p>
         { course.ratings >0 &&  <div className="flex items-center text-yellow-500">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < course.ratings ? 'fill-current' : 'text-gray-300'}`} />
              ))}
              <span className="ml-2 text-gray-500">({course.ratings})</span>
            </div>}
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );

  const renderInstructors = () => (
    <div>
      {school?.instructors?.length ? (
        school.instructors.map((instructor) => (
            <div className="border shadow-sm p-2 rounded-md hidden lg:flex items-center gap-3 mt-2 lg:mt-0 xl:mt-0 ">
            <img
              src={instructor?.instructor?.avatar}
              width="50px"
              height="50px"
              className="rounded-full border border-gray-300"
              alt="instructor Avatar"
            />
            <div>
              <p className="text-sm sm:text-l font-semibold text-gray-700">
                {instructor?.instructor?.name}
              </p>
              <p className="text-xs text-gray-500">{instructor?.instructor?.email}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No instructors available.</p>
      )}
    </div>
  );

  const renderLearners = () => (
    <div>
      {school?.learners?.length ? (
        school.learners.map((learner) => (
             <div className="border shadow-sm p-2 rounded-md hidden lg:flex items-center gap-3 mt-2 lg:mt-0 xl:mt-0 ">
             <img
               src={learner?.learner?.avatar}
               width="50px"
               height="50px"
               className="rounded-full border border-gray-300"
               alt="Learner Avatar"
             />
             <div>
               <p className="text-sm sm:text-l font-semibold text-gray-700">
                 {learner?.learner?.name}
               </p>
               <p className="text-xs text-gray-500">{learner?.learner?.email}</p>
             </div>
           </div>
        ))
      ) : (
        <p>No learners available.</p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <img
            src={school?.drivingSchool?.avatar}
            alt={`${school?.drivingSchool?.drivingSchoolName} Avatar`}
            className="w-32 h-32 rounded-full border border-gray-300"
          />
          <div className=" lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-700">{school?.drivingSchool?.drivingSchoolName}</h2>
            <p className='py-2 text-md'>ID : {school?.drivingSchool?._id }</p>

            <p className="text-gray-500">{school?.drivingSchool?.location}</p>
            <p className="text-gray-500 mt-2">Created At: {new Date(school?.drivingSchool?.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-500">Updated At: {new Date(school?.drivingSchool?.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Owner Details */}
        <div>
            <p className="text-2xl pt-4 font-semibold text-gray-700">Owner Details</p>
            <div className="lg:flex items-center gap-3 mt-2 lg:mt-0 xl:mt-0 ">
                      <img
                        src={school?.drivingSchool?.owner?.avatar}
                        width="50px"
                        height="50px"
                        className="rounded-full border border-gray-300"
                        alt="Owner Avatar"
                      />
                      <div>
                        <p className="text-sm sm:text-l font-semibold text-gray-700">
                          {school?.drivingSchool?.owner?.name}
                        </p>
                        <p className="text-xs text-gray-500">{school?.drivingSchool?.owner?.email}</p>
                      </div>
                    </div>
        </div>

        <div style={{overflowX:'auto'}} className="mt-4 flex items-center gap-4">
          <button
            className={`text-xs  py-2 px-4 rounded-lg ${activeTab === 'courses' ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-primary-light`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`text-xs py-2 px-4 rounded-lg ${activeTab === 'instructors' ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-primary-light`}
            onClick={() => setActiveTab('instructors')}
          >
            Instructors
          </button>
          <button
            className={`text-xs py-2 px-4 rounded-lg ${activeTab === 'learners' ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-primary-light`}
            onClick={() => setActiveTab('learners')}
          >
            Learners
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'instructors' && renderInstructors()}
        {activeTab === 'learners' && renderLearners()}
      </div>
    </div>
  );
};

export default SingleDrivingSchool;
