import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../utils/Spinner';
import { Error, getSingleCourse, singleCourse, Status } from '../slices/commonSlice';
import { loadUser, loginAuthUser } from '../slices/authSlice';
import { allCourses, clearUpdated, getMyCourses, IsUpdate, Status as LearnStatus, applyCourse, giveRatingCourse } from '../slices/learnerSlice';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';

const CommonSingleCourse = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const error = useSelector(Error);
    const course = useSelector(singleCourse);
    const navigate = useNavigate();
    const user = useSelector(loginAuthUser);
    const myCourses = useSelector(allCourses);
    const isUpdate = useSelector(IsUpdate);
    const learnStatus = useSelector(LearnStatus);
    const [openReviewModel, setOpenReviewModel] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        dispatch(getSingleCourse(id));
        dispatch(loadUser());
    }, [dispatch, id]);

    useEffect(() => {
        if (user?.role === "learner") {
            dispatch(getMyCourses());
        }
        if (isUpdate) {
            dispatch(getSingleCourse(id));
            dispatch(clearUpdated());
        }
    }, [dispatch, user, isUpdate]);

    const isCourseApplied = (courseId) => {
        return myCourses?.pendingCourse?.some(course => course.course?._id === courseId);
    };

    const isCourseApproved = (courseId) => {
        return myCourses?.approvedCourse?.some(course => course.course?._id === courseId);
    };

    const isCourseRejected = (courseId) => {
        return myCourses?.rejectedCourse?.some(course => course.course?._id === courseId);
    };

    const handleApplyCourse = (id) => {
        dispatch(applyCourse({ courseId: id }));
    };

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = () => {
        dispatch(giveRatingCourse({ courseId: id, rating, comment }))
        setOpenReviewModel(false);
    };

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    const isLearner = user?.role === "learner";

    return (
        <div className="min-h-screen max-w-5xl mt-5 mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="w-full flex flex-col md:flex-row justify-between gap-6">
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center space-x-4 mb-4">
                            <img src={course?.drivingSchool?.avatar} alt="School Logo" className="w-16 h-16 rounded-full" />
                            <div>
                                <h1 className="text-2xl font-bold">{course?.title}</h1>
                                <p className="text-gray-600">{course?.drivingSchool?.drivingSchoolName}, {course?.drivingSchool?.location}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{course?.description}</p>
                        <p><strong>Duration:</strong> {course?.duration} hour(s)</p>
                        <p><strong>Price:</strong> ₹ {course?.price}</p>
                        {course?.ratings > 0 && <p><strong>Ratings:</strong> {course?.ratings}</p>}
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-3">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Instructor(s)</h2>
                            {course?.instructor && course?.instructor.length > 0 ? (
                                course?.instructor.map((instructor, index) => (
                                    <div onClick={() => navigate(`/instructor/${instructor._id}`)} key={index} className="border rounded-md p-3 flex gap-3 items-center mb-4 hover:bg-gray-100 transition">
                                        <img src={instructor?.avatar} alt="Instructor Avatar" className="w-12 h-12 rounded-full" />
                                        <div>
                                            <h3 className="text-lg font-bold">{instructor?.name}</h3>
                                            <p className="text-sm text-gray-600">{instructor?.email}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No instructors available.</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            {isLearner && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApplyCourse(course._id);
                                    }}
                                    disabled={isCourseApplied(course._id) || isCourseApproved(course._id) || isCourseRejected(course._id) || learnStatus === "loading"}
                                    className={`mt-2 w-full font-semibold py-2 text-white text-center rounded-md ${isCourseApplied(course._id) ? 'bg-blue-400' : isCourseApproved(course._id) ? 'bg-green-500' : isCourseRejected(course._id) ? 'bg-red-500' : 'bg-primary-dark'}`}
                                >
                                    {learnStatus === "loading" && !isCourseApplied(course._id) ? (
                                        <Spinner />
                                    ) : isCourseApplied(course._id) ? (
                                        'APPLIED'
                                    ) :
                                        isCourseApproved(course._id) ? (
                                            'APPROVED'
                                        ) :
                                            isCourseRejected(course._id) ? (
                                                'REJECTED'
                                            ) :
                                                (
                                                    'APPLY'
                                                )}
                                </button>
                            )}
                            <button onClick={() => setOpenReviewModel(true)} className="py-2 bg-primary-dark text-white rounded-md">Review</button>
                        </div>
                    </div>
                </div>
            </div>
            {course?.services && course?.services.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Services</h2>
                    <ul className="space-y-3">
                        {course?.services.map((service, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="font-bold">{service.serviceName} ({service.vehicleType})</h3>
                                <p className="text-sm">{service.description}</p>
                                <p><strong>Price:</strong> ₹ {service.price}</p>
                                <p><strong>Certificates Issued:</strong> {service.certificatesIssued.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {course?.vehicles && course?.vehicles.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Vehicles</h2>
                    <ul className="space-y-3">
                        {course?.vehicles.map((vehicle, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="font-bold">{vehicle.name} ({vehicle.type})</h3>
                                <p>Registration Number: {vehicle.registrationNumber}</p>
                                <p>Last Service: {new Date(vehicle.lastServiceDate).toLocaleDateString()}</p>
                                <p>Next Service: {new Date(vehicle.nextServiceDate).toLocaleDateString()}</p>
                                <p>Certificates: {vehicle.certificates.map(c => c.name).join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {course?.learners && course?.learners.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Learners</h2>
                    <ul className="space-y-3">
                        {course?.learners.map((learner, index) => (
                            <li key={index} className="flex gap-2 items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <img src={learner?.learner.avatar} alt="" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h3 className="font-bold">{learner.learner?.name}</h3>
                                    <p>Email: {learner.learner?.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {
                course.reviews && course.reviews.length > 0 && (
                    <> <h2 className="text-xl font-semibold mb-4">Reviews</h2>

                        {course.reviews.map((review, index) => (
                            <li key={index} className="my-1 flex gap-3 items-center p-4 bg-gray-50 border shadow-sm rounded-lg">
                                <img src={review?.user.avatar} alt={review?.user.name} className="border w-8 h-8 rounded-full" />
                                <div>
                                 
                                    <p className="text-gray-400 text-xs my-2">{review.user?.email}</p>
                                    <div className='flex gap-1'>   
                                         {[...Array(5)].map((star, index) => (
                                        <FaStar
                                            key={index}
                                            className="star"
                                            size={15}
                                            color={index < review?.rating ? '#ffc107' : '#e4e5e8'}
                                        />
                                    ))}
                                    </div>
                                    <p >{review?.comment}</p>

                                </div>
                            </li>
                        ))}
                    </>
                )
            }

            <Modal show={openReviewModel} onHide={() => setOpenReviewModel(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate and Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="d-flex justify-content-center align-items-center">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={index}>
                                        <input
                                            type="radio"
                                            name="rating"
                                            value={ratingValue}
                                            onClick={() => handleStarClick(ratingValue)}
                                            style={{ display: 'none' }}
                                        />
                                        <FaStar
                                            className="star hover:cursor-pointer"
                                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                            size={30}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(rating)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <Form.Group controlId="comment" className="mt-4">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control as="textarea" rows={3} value={comment} onChange={handleCommentChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpenReviewModel(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CommonSingleCourse;
