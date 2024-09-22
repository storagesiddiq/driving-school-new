import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Error, getSingleCourse, singleCourse, Status } from '../../slices/ownerSlice';
import Spinner from '../../utils/Spinner';

const SingleCourse = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const error = useSelector(Error);
    const course = useSelector(singleCourse);

    useEffect(() => {
        dispatch(getSingleCourse(id));
    }, [dispatch, id]);

    if (status === 'loading') return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    console.log(course);

    return (
        <div className="h-screen max-w-5xl mx-auto p-4">
            {/* Course Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="w-full flex flex-col md:flex-row justify-between">
                    {/* Course Info */}
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                        <div className="flex flex-col  md:items-center space-y-4 md:space-y-0 mb-4">
                            <img
                                src={course?.image}
                                className="rounded-md border"
                                style={{ objectFit: 'cover', display: 'block', height: '180px', width: '100%' }}
                                alt="Course Avatar"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{course?.title}</h1>
                                <p className="text-gray-600">{course?.drivingSchool?.drivingSchoolName}, {course?.drivingSchool?.location}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">{course?.description}</p>
                        <p><strong>Duration:</strong> {course?.duration} hour(s)</p>
                        {course?.ratings > 0 && <p><strong>Ratings:</strong> {course?.ratings}</p>}
                    </div>

                    {/* Instructor Info */}
                    <div className="lg:w-1/2  flex flex-col items-center mt-6 md:mt-0">
                        <h1 className='text-2xl'>  Instructor </h1>
                        {course?.instructor && course?.instructor.length > 0 &&
                            course?.instructor.map((instructor, index) => (
                                <div key={index} className="my-2 border rounded-md p-2 flex gap-3 items-center mb-4">
                                    <img src={instructor?.avatar} alt="Instructor Avatar" className="w-10 h-10 rounded-full mx-auto" />
                                    <div> <h2 className="text-l font-bold ">{instructor?.name}</h2>
                                        <p className="text-xs text-gray-600">{instructor?.email}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>


            {/* Services */}
            {course?.services && course?.services.length > 0 && <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Services</h2>
                <ul className="space-y-2">
                    {course?.services.map((service, index) => (
                        <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <h3 className="font-bold">{service.serviceName} ({service.vehicleType})</h3>
                            <p className="text-sm">{service.description}</p>
                            <p className="font-semibold">Price: ${service.price}</p>
                        </li>
                    ))}
                </ul>
            </div>}

            {/* Vehicles */}
            {course?.vehicles && course?.vehicles.length > 0 &&
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Vehicles</h2>
                    <ul className="space-y-2">
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
                </div>}

            {/* Sessions */}
            {course?.sessions && course?.sessions.length > 0 && <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Sessions</h2>
                <ul className="space-y-2">
                    {course?.sessions.map((session, index) => (
                        <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <p><strong>Status:</strong> {session.status}</p>
                            <p><strong>Start Time:</strong> {session.startTime} - <strong>End Time:</strong> {session.endTime}</p>
                            <p><strong>End Date:</strong> {new Date(session.endDate).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>}

            {/* Learners */}
            {course?.learners && course?.learners.length > 0 && <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Learners</h2>
                <ul className="space-y-2">
                    {course?.learners.length > 0 ? (
                        course?.learners.map((learner, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="font-bold">{learner.name}</h3>
                                <p>Email: {learner.email}</p>
                            </li>
                        ))
                    ) : (
                        <p>No learners enrolled yet.</p>
                    )}
                </ul>
            </div>}

            {/* Reviews */}
            {course?.reviews && course?.reviews.length > 0 && <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <ul className="space-y-2">
                    {course?.reviews.length > 0 ? (
                        course?.reviews.map((review, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <p>{review.comment}</p>
                                <p><strong>Rating:</strong> {review.rating} / 5</p>
                                <p><strong>By:</strong> {review.reviewer.name}</p>
                            </li>
                        ))
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </ul>
            </div>}
        </div>
    );
}

export default SingleCourse;
