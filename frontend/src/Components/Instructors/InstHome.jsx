import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Error, getInstructorProfile, Status, myProfile } from '../../slices/instructorSlice';
import AttendancePieChart from '../../utils/AttendancePieChart';
import AttendanceCalendar from '../../utils/AttendanceCalendar ';
import { useNavigate } from 'react-router-dom';

const InstHome = () => {
  const dispatch = useDispatch();
  const instructorData = useSelector(myProfile);
  const status = useSelector(Status);
  const error = useSelector(Error);
  const navigate = useNavigate();

  const { instructor, courses, attendance } = instructorData;
  const totalAttendance = attendance?.length;
  const totalPresent = attendance?.filter(record => record.status === 'Present').length;
  const attendancePercentage = totalAttendance > 0 ? ((totalPresent / totalAttendance) * 100).toFixed(2) : 0;
  const fromDate = instructor?.createdAt ? new Date(instructor.createdAt).toISOString().split('T')[0] : null;

  useEffect(() => {
    dispatch(getInstructorProfile());
  }, [dispatch]);

  return (
    <>
      {status === 'loading' && (
        <div className="mt-5 bg-gray-100 container mx-auto p-4">
          {/* Skeleton Loader for Courses */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-300 p-4 rounded-lg shadow-sm">
                  <div className="h-5 bg-gray-400 rounded mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded mb-1"></div>
                  <div className="h-4 bg-gray-400 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton Loader for Attendance */}
          <div className="md:flex md:space-x-8">
            <div className="flex-1 shadow bg-white p-6 rounded-lg mb-6 md:mb-0">
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="flex-1 shadow bg-white p-2 rounded-lg">
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="w-full h-48 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-5 bg-red-100 text-red-600 border border-red-300 p-4 rounded-lg container mx-auto">
          <p>Error: {error}</p>
        </div>
      )}

      {status === 'succeeded' && (
        <div className="mt-5 bg-gray-100 container mx-auto p-4">
          {/* Courses Section */}
          {courses.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Courses</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    onClick={() => navigate(`/course/${course._id}`)}
                    key={course._id}
                    className="hover:bg-primary border hover:cursor-pointer bg-primary-dark text-white p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="text-l font-semibold text-white">{course.title}</h3>
                    <p className="text-white mt-2">
                      <strong>Duration:</strong> {course.duration} Weeks
                    </p>
                    <p className="text-white mt-2">
                      <strong>Description:</strong> {course.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Section */}
          <div className="md:flex md:space-x-8">
            {/* Attendance Pie Chart */}
            <div className="flex-1 shadow bg-white p-6 rounded-lg mb-6 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h3>
              <AttendancePieChart attendancePercentage={attendancePercentage} />
            </div>

            {/* Attendance Calendar */}
            <div className="flex-1 shadow bg-white p-2 rounded-lg">
              <AttendanceCalendar
                isAdmin={false}
                id={instructor?._id}
                attendaceData={attendance}
                fromDate={fromDate}
                totalAttendanceDays={totalAttendance}
                totalPresentDays={totalPresent}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstHome;
