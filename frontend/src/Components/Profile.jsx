import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, editUser, isUpdated, loginAuthError, loginAuthStatus, loginAuthUser } from '../slices/authSlice';
import { Edit } from 'react-feather';
import { allCourses, allSessions, getMyCourses, getMySession } from '../slices/learnerSlice';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { allAttenDates, getAllDates } from '../slices/instructorSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // Redux state
  const user = useSelector(loginAuthUser);
  const IsUpdated = useSelector(isUpdated);
  const loginError = useSelector(loginAuthError);
  const status = useSelector(loginAuthStatus);
  const myCourses = useSelector(allCourses);
  const mySessions = useSelector(allSessions);
  const attendanceData = useSelector(allAttenDates);

  const [selectedSession, setSelectedSession] = useState(null)
  const [show, setShow] = useState(false)

  const handleSessionClick = (session) => {
    setSelectedSession(session)
    dispatch(getAllDates(session._id));
    setShow(true)
  }

  const handleCloseModal = () => {
    setSelectedSession(null)
    setShow(false)

  }
  // Local state
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '/default-avatar.png');
  const [isEditing, setIsEditing] = useState({ name: false, email: false, avatar: false });
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [error, setError] = useState(null);
  const [showCourses, setShowCourses] = useState(true);
  const [showSession, setShowSession] = useState(false);

  // Load user on component mount
  useEffect(() => {
    if (loginError) {
      setError(loginError);
      dispatch(clearError());
    }
  }, [dispatch, loginError]);

  useEffect(() => {
    if (user?.role === 'learner') {
      dispatch(getMySession());
      dispatch(getMyCourses());
    }
  }, [dispatch, user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle submit to update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('email', updatedUser.email);
    if (avatar) formData.append('avatar', avatar);
    dispatch(editUser(formData));
  };

  const isLearner = user?.role === 'learner';

  // Toggle Course List Visibility
  const handleCoursetoggle = () => {
    setShowCourses(true);
    setShowSession(false);
  };

  const handleSessionetoggle = () => {
    setShowCourses(false);
    setShowSession(true);
  }


  return (
    <div className="min-h-screen container mx-auto p-6">
      <h1 className="text-2xl mt-5 font-bold mb-6 text-blue-800">Profile Settings</h1>
      {/* Success and Error Messages */}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {status === 'loading' && <p className="text-blue-500">Updating...</p>}
      {IsUpdated && <div className="text-green-600 text-sm">Profile Updated Successfully</div>}

      <form
        onSubmit={handleSubmit}
        className={`bg-white border shadow-md rounded-lg p-6 mx-auto space-y-6 ${isLearner ? '' : 'max-w-lg'
          } flex flex-col justify-center items-center `}
      >
        {/* Avatar Section */}
        <div className="flex  items-center space-x-6">
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full border border-gray-300 shadow-lg"
          />
          {isEditing.avatar ? (
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="flex gap-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                onChange={handleAvatarChange}
              />
              <div className='flex items-center gap-3'> 
              <button
                type="submit"
                className="px-2 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
              >
                Update Avatar
              </button>
              <button
                  type="button"
                  onClick={()=> setIsEditing({ ...isEditing, avatar: false })}
                  className="px-2 py-1 text-white bg-red-600 rounded-lg hover:bg-red-500"
                >
                  cancel
                </button>
                </div>
            </div>
          ) : (
            <Edit
              className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-500"
              onClick={() => setIsEditing({ ...isEditing, avatar: true })}
            />
          )}
        </div>

        {/* User Details Section */}
        <div className="lg:w-2/3 space-y-6">
          {/* Name Section */}
          <div className="space-y-2 ">
            <label className="block  text-gray-700 font-semibold">Name</label>
            {isEditing.name ? (
              <div className="border p-1 rounded-md flex items-center space-x-4">
                <input
                  type="text"
                  name="name"
                  value={updatedUser.name}
                  onChange={handleInputChange}
                  className="border border-black-200 p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={()=> setIsEditing({ ...isEditing, name: false })}
                  className="px-2 py-1 text-white bg-red-600 rounded-lg hover:bg-red-500"
                >
                  cancel
                </button>
              </div>
            ) : (
              <div className="border p-1 rounded-md flex items-center justify-between">
                <p className="text-gray-800">{user?.name}</p>
                <Edit
                  className="w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-500"
                  onClick={() => setIsEditing({ ...isEditing, name: true })}
                />
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Email</label>
            <div className='border p-1 rounded-md'>{user?.email}</div>
          </div>
        </div>

      </form>


      {/* Extra Section for Learners */}
      {isLearner && (
        <div className="flex flex-col mt-3 gap-3">

          <div className='flex items-center gap-3'>
            <button
              type="button"
              onClick={handleCoursetoggle}
              className={`${showCourses ? 'bg-primary-dark text-white' : 'border border-bg-primary text-black-400'} rounded-md text-semibold  p-2`}
            >
              My Courses
            </button>
            <button
              type="button"
              onClick={handleSessionetoggle}
              className={`${showSession ? 'bg-primary-dark text-white' : 'border border-bg-primary text-black-400'} rounded-md text-semibold  p-2`}
            >
              My Attendance
            </button>
          </div>
          {showCourses && (
            <div className="space-y-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-8">
              {/* Approved Courses Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Approved Courses</h2>
                  <span className="text-sm text-gray-600">{myCourses?.approvedCourse?.length} Courses</span>
                </div>
                {myCourses?.approvedCourse?.length > 0 ? (
                  <ul className="space-y-3">
                    {myCourses.approvedCourse.map((course, index) => (
                      <li
                        onClick={() => navigate(`/course/${course.course._id}`)}

                        key={index}
                        className="hover:cursor-pointer hover:bg-primary-light p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:shadow-md hover:bg-green-100 transition"
                      >
                        <p className="text-lg font-medium text-gray-700">{course.course.title} from {course.drivingSchool.drivingSchoolName}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No approved courses.</p>
                )}
              </div>

              {/* Pending Courses Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Pending Courses</h2>
                  <span className="text-sm text-gray-600">{myCourses?.pendingCourse?.length} Courses</span>
                </div>
                {myCourses?.pendingCourse?.length > 0 ? (
                  <ul className="space-y-3">
                    {myCourses.pendingCourse.map((course, index) => (
                      <li
                        onClick={() => navigate(`/course/${course.course._id}`)}

                        key={index}
                        className="hover:cursor-pointer hover:bg-primary-light p-3 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm hover:shadow-md hover:bg-yellow-100 transition"
                      >
                        <p className="text-lg font-small text-gray-700">{course.course.title} from {course.drivingSchool.drivingSchoolName} </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No pending courses.</p>
                )}
              </div>

              {/* Rejected Courses Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Rejected Courses</h2>
                  <span className="text-sm text-gray-600">{myCourses?.rejectedCourse?.length} Courses</span>
                </div>
                {myCourses?.rejectedCourse?.length > 0 ? (
                  <ul className="space-y-3">
                    {myCourses.rejectedCourse.map((course, index) => (
                      <li
                        onClick={() => navigate(`/course/${course.course._id}`)}
                        key={index}
                        className="hover:cursor-pointer hover:bg-primary-light p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm hover:shadow-md hover:bg-red-100 transition"
                      >
                        <p className="text-lg font-medium text-gray-700">{course.course.title} from {course.drivingSchool.drivingSchoolName} </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No rejected courses.</p>
                )}
              </div>
            </div>

          )}

          {showSession && (
            <div className="space-y-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-8">
              <h2 className="text-xl font-semibold text-gray-800">My Attendance</h2>

              {mySessions && mySessions.length > 0 && mySessions?.map((session, index) => (
                <div
                  key={session._id}
                  className="flex justify-between items-center p-4 bg-white shadow-md rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSessionClick(session)}
                >
                  {/* Left side: Course details */}
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{session?.course?.title}</h2>
                    <p className="text-gray-500">{session?.course?.description}</p>
                    <p className="text-gray-400 text-sm">Duration: {session?.course?.duration} weeks(s)</p>
                  </div>

                  {/* Right side: Instructor and Driving School details */}
                  <div className="flex-1 text-right">
                    <h3 className="font-medium">{session?.instructor?.name}</h3>
                    <p className="text-gray-500">{session?.instructor?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Modal for session details */}
      <Modal show={show} fullscreen='md-down' onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedSession?.course.title} Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attendanceData.length > 0 && (
            <>  <div className="grid grid-cols-4 gap-2">
              {attendanceData.map((att, index) => (
                <div
                  className={`rounded-md ${att.status === "Present" ? 'bg-green-500' : att.status === "Absent" ? 'bg-red-800 text-white' : 'bg-gray-300'} flex flex-col items-center justify-center border border-gray-300 p-2 text-center`}
                  key={index}
                >
                  <div className="text-lg font-bold">{att.formattedDate.Day}</div>
                  <div className="text-sm">{att.formattedDate.Date} {att.formattedDate.Month}</div>
                </div>
              ))}
            </div>
            </>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Profile;
