import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearPatched, clearUpdated, Error, getMySchool, IsPatched, IsUpdated, mySchool, patchMySchoolAvatar, patchMySchoolBanner, Status, updateMySchool } from '../../slices/ownerSlice';
import { Star, Edit } from 'react-feather'; // Ensure you have the `react-feather` package installed for icons
import SkeletonLoader from '../../Skeletons/SkeletonLoader';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
    const dispatch = useDispatch();
    const school = useSelector(mySchool);
    const status = useSelector(Status);
    const error = useSelector(Error);
    const isPatched = useSelector(IsPatched)
    const isUpdated = useSelector(IsUpdated)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('courses');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        drivingSchoolName: school?.drivingSchool?.drivingSchoolName || '',
        location: school?.drivingSchool?.location || ''
    });
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        dispatch(getMySchool());
        if (isUpdated) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 1000);
            dispatch(clearUpdated())
            setShowModal(false);
            return () => clearTimeout(timer);
        }
        if (isPatched) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 1000);
            dispatch(clearPatched())
            return () => clearTimeout(timer);
        }
        if (error) {
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 1000);
            dispatch(clearError())
            return () => clearTimeout(timer);
        }
    }, [dispatch, isPatched, error, isUpdated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        dispatch(updateMySchool(formData))
    };

    const handleFileChange = (e, type) => {
        console.log("TRIGGERERD");

        const file = e.target.files[0];
        if (type === 'banner') {
            const formData = new FormData()
            formData.append('bannerImg', file)
            dispatch(patchMySchoolBanner(formData))
        } else if (type === 'avatar') {
            const formData = new FormData()
            formData.append('avatar', file)
            dispatch(patchMySchoolAvatar(formData))
        }
    };


    if (status === 'loading') {
        return (
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <SkeletonLoader type="avatar" />
                    <SkeletonLoader type="card" />
                    <SkeletonLoader type="card" />
                    <SkeletonLoader type="card" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <SkeletonLoader />
                    <SkeletonLoader />
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-500 text-center py-4">Error: {error.message}</div>;

    const renderCourses = () => (
        <div>
            {school?.course?.length ? (
                school.course.map((course) => (
                    <div onClick={() => navigate(`/owner/course/${course._id}`)} key={course._id} className="border bg-white p-4 rounded-lg shadow-md mb-4">
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
            ) : (
                <p className="text-center py-4">No courses available.</p>
            )}
        </div>
    );

    const renderInstructors = () => (
        <div>
            {school?.Instructors?.length ? (
                school.Instructors.map((instructor) => (
                    <div key={instructor._id} className="border shadow-sm p-4 rounded-md flex items-center gap-4 mb-4">
                        <img
                            src={instructor?.instructor?.avatar}
                            width="50"
                            height="50"
                            className="rounded-full border border-gray-300"
                            alt="Instructor Avatar"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-700">{instructor?.instructor?.name}</p>
                            <p className="text-xs text-gray-500">{instructor?.instructor?.email}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center py-4">No instructors available.</p>
            )}
        </div>
    );

    console.log(school);


    return (
        <>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                }}>
                <Toast.Header>
                    <strong className="mr-auto">Success</strong>
                </Toast.Header>
                {isPatched && <Toast.Body className='bg-success'>Image Updated Successfully!</Toast.Body>}
                {error && <Toast.Body className='bg-danger'>{error}</Toast.Body>}
            </Toast>

            <div className="p-2 bg-gray-100 min-h-screen">
                {/* Banner Image and Avatar */}
                <div className="relative">
                    <img
                        src={school?.drivingSchool?.bannerImg}
                        alt="Banner"
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                        onClick={() => document.getElementById('banner-upload').click()}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                        <Edit className="w-5 h-5 text-gray-700" />
                    </button>
                    <input
                        type="file"
                        id="banner-upload"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'banner')}
                        className="hidden"
                    />
                    <div className="z-30 absolute bottom-0 left-4 transform translate-y-1/2 rounded-t-lg">
                        <img
                            src={school?.drivingSchool?.avatar}
                            alt={`${school?.drivingSchool?.drivingSchoolName} Avatar`}
                            className="w-24 h-24 shadow-md rounded-full border border-gray-700"
                        />
                        <button
                            onClick={() => document.getElementById('avatar-upload').click()}
                            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
                        >
                            <Edit className="w-5 h-5 text-gray-700" />
                        </button>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'avatar')}
                            className="hidden"
                        />
                    </div>
                </div>

                {/* School Details */}
                <div className="bg-white p-6 rounded-lg shadow-md relative">
                    <div className="lg:flex lg:items-start lg:gap-6">
                        <div className="lg:w-1/2 mt-6">
                            <div className='flex gap-3'>
                                <h2 className="text-3xl font-bold text-gray-800">{school?.drivingSchool?.drivingSchoolName}</h2>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-2 text-primary-dark hover:underline"
                                >
                                    <Edit className="w-5 h-5 inline-block" /> Edit
                                </button>
                            </div>
                            <p className="text-gray-500">{school?.drivingSchool?.location}</p>

                        </div>

                        {/* Owner Details */}
                        <div className="lg:w-1/2 lg:mt-3 lg:mt-0 sm:mt-5">
                            <div className="flex items-center gap-4 mt-4">
                                <img
                                    src={school?.drivingSchool?.owner?.avatar || 'default-owner-avatar.jpg'}
                                    width="60"
                                    height="60"
                                    className="rounded-full border border-gray-300"
                                    alt="Owner Avatar"
                                />
                                <div>
                                    <p className="text-lg font-semibold text-gray-800">{school?.drivingSchool?.owner?.name}</p>
                                    <p className="text-sm text-gray-500">{school?.drivingSchool?.owner?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 w-full flex overflow-x-auto gap-4">
                        <button
                            className={`w-1/3 py-2 px-4 rounded-lg text-xs font-semibold ${activeTab === 'courses' ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-primary-light`}
                            onClick={() => setActiveTab('courses')}
                        >
                            Courses
                        </button>
                        <button
                            className={`w-1/3 py-2 px-4 rounded-lg text-xs font-semibold ${activeTab === 'instructors' ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-700'} hover:text-white hover:bg-primary-light`}
                            onClick={() => setActiveTab('instructors')}
                        >
                            Instructors
                        </button>
                    </div>
                </div>

                <div className="my-4 p-4 bg-white shadow-sm border rounded-md">
                    {/* School Email */}
                    {school?.drivingSchool?.schoolEmail && (
                        <div className="flex items-center gap-2 border rounded-md p-2 my-2">
                            <span className="w-1/2 font-semibold">Driving School Email:</span>
                            <span className="w-1/2  text-gray-700">{school?.drivingSchool?.schoolEmail}</span>
                        </div>
                    )}

                    {/* School Number */}
                    {school?.drivingSchool?.schoolNumber && (
                        <div className="flex items-center justify-between gap-2 border rounded-md p-2 my-2">
                            <span className="w-1/2 font-semibold">Driving School Number:</span>
                            <span className="w-1/2 text-gray-700">{school?.drivingSchool?.schoolNumber}</span>
                        </div>
                    )}

                    {/* School Registration Number */}
                    {school?.drivingSchool?.schoolRegNumber && (
                        <div className="flex items-center justify-between gap-2 border rounded-md p-2 my-2">
                            <span className="w-1/2 font-semibold">Driving School Registration Number:</span>
                            <span className="w-1/2 text-gray-700">{school?.drivingSchool?.schoolRegNumber}</span>
                        </div>
                    )}

                    {/* Website */}
                    {school?.drivingSchool?.website && (
                        <div className="flex items-center justify-between gap-2 border rounded-md p-2 my-2">
                            <span className="w-1/2 font-semibold">Website:</span>
                            <a
                                href={school?.drivingSchool?.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-1/2 text-blue-600 hover:underline"
                            >
                                {school?.drivingSchool?.website}
                            </a>
                        </div>
                    )}

                    {/* WhatsApp Number */}
                    {school?.drivingSchool?.whatsapp && (
                        <div className="flex items-center justify-between gap-2 border rounded-md p-2 my-2">
                            <span className="w-1/2 font-semibold">WhatsApp Number:</span>
                            <span className="w-1/2 text-gray-700">{school?.drivingSchool?.whatsapp}</span>
                        </div>
                    )}
                </div>



                <div className="bg-white p-6 rounded-lg shadow-md">
                    {activeTab === 'courses' && renderCourses()}
                    {activeTab === 'instructors' && renderInstructors()}
                </div>

                {/* Modal for updating driving school name and location */}
                <Modal fullscreen="md-down" centered show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update School Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formDrivingSchoolName">
                                <Form.Label>Driving School Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter driving school name"
                                    name="drivingSchoolName"
                                    value={formData.drivingSchoolName}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLocation">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <button className='w-full bg-primary-dark rounded-md text-white py-2 mt-10' variant="primary" type="submit">
                                Update
                            </button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
};

export default OwnerDashboard;
