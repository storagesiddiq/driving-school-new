import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Spinner from '../../utils/Spinner';
import { Error, getSingleInstructor, singleInstructor, Status } from '../../slices/ownerSlice';
import AttendanceCalendar from '../../utils/AttendanceCalendar ';
import AttendancePieChart from '../../utils/AttendancePieChart';
import { Star } from 'react-feather'; // Ensure you have the `react-feather` package installed for icons


const SingleInstructor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const status = useSelector(Status);
  const error = useSelector(Error);
  const instructorData = useSelector(singleInstructor);

  useEffect(() => {
    dispatch(getSingleInstructor(id));
  }, [dispatch, id]);

  if (status === 'loading') return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  // Destructuring the instructor data
  const { instructor, totalAttendanceDays, totalPresentDays, attendancePercentage } = instructorData || {};
  const instructorDetails = instructor?.instructor || {}; // Access nested instructor details
  console.log(instructorData);

  const fromDate = instructorData?.instructor?.createdAt ? new Date(instructorData.instructor.createdAt).toISOString().split('T')[0] : null;

  return (
    <div className="container rounded-md bg-gray-200 mx-auto p-2">
      {/* Instructor Details */}
      <div className="bg-white mx-auto p-3">
        <div className="mb-8 text-center">
          <img src={instructorDetails?.avatar} alt="Instructor Avatar" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-2xl font-bold">{instructorDetails?.name}</h2>
          <p className="text-gray-600">{instructorDetails?.email}</p>
        </div>

        {/* Attendance Pie Chart */}
        <AttendancePieChart attendancePercentage={attendancePercentage} />

        {/* Attendance Calendar */}
        <AttendanceCalendar id={instructorData?.instructor?._id} attendaceData={instructorData?.instructor?.attendance} fromDate={fromDate} totalAttendanceDays={totalAttendanceDays} totalPresentDays={totalPresentDays} />

        <div>
          {instructorData?.instructor?.courses && instructorData?.instructor?.courses.length > 0 && <h1 className="my-2 text-xl font-semibold">Associated Courses</h1>}
          <div>
            {
              instructorData?.instructor?.courses && instructorData?.instructor?.courses.length > 0
              && instructorData?.instructor.courses.map(course => {
                <div key={course._id} className="border bg-white p-4 rounded-lg shadow-md mb-4">
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
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleInstructor;
