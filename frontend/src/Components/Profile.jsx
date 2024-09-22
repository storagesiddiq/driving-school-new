import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearUpdated, editUser, isUpdated, loadUser, loginAuthError, loginAuthStatus, loginAuthUser } from '../slices/authSlice';
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

  const [updatedUser, setUpdatedUser] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    ...(user?.role === "learner" && {
      dateOfBirth: user?.learner?.dateOfBirth || '',
      isDrivingLicense: user?.learner?.isDrivingLicense || '',
      driversLicenseNumber: user?.learner?.driversLicenseNumber || '',
      address: user?.learner?.address || '',

      idProofNo: user?.learner?.idProofNo || '',
      parName: user?.learner?.parentGuardianInfo?.name || '',
      parNumber: user?.learner?.parentGuardianInfo?.phoneNumber || '',
    }),
    ...(user?.role === "owner" && {
      about: user?.owner?.about || '',
      location: user?.owner?.location || '',
      website: user?.owner?.website || '',
      address: user?.owner?.address || '',
      schoolEmail: user?.owner?.schoolEmail || '',
      schoolNumber: user?.owner?.schoolNumber || '',
      schoolRegNumber: user?.owner?.schoolRegNumber || '',
      whatsapp: user?.owner?.whatsapp || '',
    }),
    ...(user?.role === "instructor" && {
      experience: user?.instructor?.experience || '',
      bio: user?.instructor?.bio || '',

    })
  }));


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
    if (IsUpdated) {
      dispatch(loadUser())
      dispatch(clearUpdated())
    }
  }, [IsUpdated, dispatch, user]);

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

  const isLearner = user?.role === 'learner';
  const isOwner = user?.role === 'owner';
  const isInstructor = user?.role === 'instructor';

  // Handle submit to update profile
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('email', updatedUser.email);
    if (avatar) formData.append('avatar', avatar);
    if (isLearner) {
      formData.append('dateOfBirth', updatedUser.dateOfBirth);
      formData.append('address', updatedUser.address);
      formData.append('isDrivingLicense', updatedUser.isDrivingLicense);
      formData.append('driversLicenseNumber', updatedUser.driversLicenseNumber);
      formData.append('idProofNo', updatedUser.idProofNo);
      formData.append('parName', updatedUser.name);
      formData.append('parPhoneNumber', updatedUser.parNumber);
    }
    if (isOwner) {
      formData.append('about', updatedUser.about);
      formData.append('location', updatedUser.location);
      formData.append('address', updatedUser.address);
      formData.append('website', updatedUser.website);
      formData.append('schoolEmail', updatedUser.schoolEmail);
      formData.append('schoolNumber', updatedUser.schoolNumber);
      formData.append('schoolRegNumber', updatedUser.schoolRegNumber);
      formData.append('whatsapp', updatedUser.whatsapp);
    }
    if (isInstructor) {
      formData.append('experience', updatedUser.experience);
      formData.append('bio', updatedUser.bio);

    }
    dispatch(editUser(formData));
  };


  // Toggle Course List Visibility
  const handleCoursetoggle = () => {
    setShowCourses(true);
    setShowSession(false);
  };

  const handleSessionetoggle = () => {
    setShowCourses(false);
    setShowSession(true);
  }

  const [openEditModel, setOpenEditModel] = useState(false)

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
          } flex flex-col lg:flex-row gap-3 justify-center items-center `}
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
                  onClick={() => setIsEditing({ ...isEditing, avatar: false })}
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
                  onClick={() => setIsEditing({ ...isEditing, name: false })}
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

      <div className='bg-white border shadow-md rounded-lg p-6 mt-2'>
        <div className='flex items-center justify-between mx-2'>
          <h1 className='font-semibold my-3 text-2xl'>Other Details</h1>

          <button onClick={() => setOpenEditModel(true)} className='border hover:bg-primary-dark p-2 rounded-md hover:text-white bg-primary-light'>Add Details</button>
        </div>

        {isLearner &&
          <div>
            {user.learner?.dateOfBirth &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Date Of Birth</label>
                <div className='border p-1 rounded-md'>{user.learner?.dateOfBirth}</div>
              </div>
            }
            {user.learner?.isDrivingLicense &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Having Driving License?</label>
                <div className='border p-1 rounded-md'>{user.learner?.isDrivingLicense}</div>
              </div>
            }
            {user.learner?.address &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Address</label>
                <div className='border p-1 rounded-md'>{user.learner?.address}</div>
              </div>
            }

            {user.learner?.driversLicenseNumber &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Driver's License Number</label>
                <div className='border p-1 rounded-md'>{user.learner?.driversLicenseNumber}</div>
              </div>
            }

            {user.learner?.idProofNo &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">ID Proof Number</label>
                <div className='border p-1 rounded-md'>{user.learner?.idProofNo}</div>
              </div>
            }

            {user.learner?.parentGuardianInfo?.name &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Parent/Guardian Name</label>
                <div className='border p-1 rounded-md'>{user.learner?.parentGuardianInfo?.name}</div>
              </div>
            }

            {user.learner?.parentGuardianInfo?.phoneNumber &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Parent/Guardian Phone Number</label>
                <div className='border p-1 rounded-md'>{user.learner?.parentGuardianInfo?.phoneNumber}</div>
              </div>
            }
          </div>
        }
        {isOwner &&
          <div>
            {user.owner?.about &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">About</label>
                <div className='border p-1 rounded-md'>{user.owner?.about}</div>
              </div>
            }
            {user.owner?.location &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Location</label>
                <div className='border p-1 rounded-md'>{user.owner?.location}</div>
              </div>
            }
            {user.owner?.address &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Address</label>
                <div className='border p-1 rounded-md'>{user.owner?.address}</div>
              </div>
            }

            {user.owner?.website &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Website</label>
                <div className='border p-1 rounded-md'>{user.owner?.website}</div>
              </div>
            }

            {user.owner?.schoolEmail &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Email</label>
                <div className='border p-1 rounded-md'>{user.owner?.schoolEmail}</div>
              </div>
            }

            {user.owner?.schoolNumber &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Driving School Number</label>
                <div className='border p-1 rounded-md'>{user.owner?.schoolNumber}</div>
              </div>
            }

            {user.owner?.schoolRegNumber &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Driving School RegNumber</label>
                <div className='border p-1 rounded-md'>{user.owner?.schoolRegNumber}</div>
              </div>
            }
            {user.owner?.whatsapp &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">WhatsApp</label>
                <div className='border p-1 rounded-md'>{user.owner?.whatsapp}</div>
              </div>
            }
          </div>
        }

        {isInstructor &&
          <div>
            {user.instructor?.experience &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Experience</label>
                <div className='border p-1 rounded-md'>{user.instructor?.experience}</div>
              </div>
            }
            {user.instructor?.bio &&
              <div className='my-2'>
                <label className="block text-gray-700 font-semibold">Bio</label>
                <div className='border p-1 rounded-md'>{user.instructor?.bio}</div>
              </div>
            }
          </div>
        }

      </div>

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
                        <p className="text-lg font-medium text-gray-700">{course?.course?.title} from {course?.drivingSchool?.drivingSchoolName}</p>
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
                        <p className="text-lg font-small text-gray-700">{course?.course?.title} from {course?.drivingSchool?.drivingSchoolName} </p>
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
                        <p className="text-lg font-medium text-gray-700">{course?.course?.title} from {course?.drivingSchool?.drivingSchoolName} </p>
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

      <Modal show={openEditModel} fullscreen='md-down' onHide={() => setOpenEditModel(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {isLearner && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold">You have a Driving License?</label>
                  <select
                    value={updatedUser?.isDrivingLicense}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, isDrivingLicense: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  >
                    <option value="">Select</option>
                    <option value={true}>YES</option>
                    <option value={false}>NO</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Date Of Birth</label>
                  <input
                    type="date"
                    value={updatedUser?.dateOfBirth}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, dateOfBirth: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* Address */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Address</label>
                  <input
                    type="text"
                    value={updatedUser?.address}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* Driver's License Number */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Driver's License Number</label>
                  <input
                    type="text"
                    value={updatedUser?.driversLicenseNumber}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, driversLicenseNumber: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* ID Proof Number */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">ID Proof Number</label>
                  <input
                    type="text"
                    value={updatedUser?.idProofNo}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, idProofNo: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* Parent/Guardian Name */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Parent/Guardian Name</label>
                  <input
                    type="text"
                    value={updatedUser?.parName}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, parName: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* Parent/Guardian Phone Number */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Parent/Guardian Phone Number</label>
                  <input
                    type="text"
                    value={updatedUser?.parNumber}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, parNumber: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

              </>

            )}

            {isOwner && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold">ABOUT</label>
                  <input
                    type="text"
                    value={updatedUser?.about}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, about: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Location</label>
                  <input
                    type="text"
                    value={updatedUser?.location}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, location: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                {/* Address */}
                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Address</label>
                  <input
                    type="text"
                    value={updatedUser?.address}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Website</label>
                  <input
                    type="text"
                    value={updatedUser?.website}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, website: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">School Email</label>
                  <input
                    type="text"
                    value={updatedUser?.schoolEmail}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, schoolEmail: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">School Number</label>
                  <input
                    type="text"
                    value={updatedUser?.schoolNumber}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, schoolNumber: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">School Register Number</label>
                  <input
                    type="text"
                    value={updatedUser?.schoolRegNumber}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, schoolRegNumber: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Whatsapp Number</label>
                  <input
                    type="text"
                    value={updatedUser?.whatsapp}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, whatsapp: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

              </>

            )}

            {isInstructor && (
              <>


                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Bio</label>
                  <input
                    type="text"
                    value={updatedUser?.bio}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, bio: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>


                <div>
                  <label className="block my-2 text-gray-700 font-semibold">Experience</label>
                  <input
                    type="number"
                    value={updatedUser?.experience}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, experience: e.target.value })}
                    className="border p-2 rounded-md w-full"
                  />
                </div>

              </>

            )}

            <button className='border font-semibold w-full mt-2 hover:bg-primary-dark p-2 rounded-md text-white bg-primary-light' type="submit">SUBMIT</button>
          </form>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default Profile;
