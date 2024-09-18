import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate, useParams } from 'react-router-dom';
import Spinner from '../utils/Spinner';
import { Error, getSingleCourse, singleCourse, Status } from '../slices/commonSlice';

const CommonSingleCourse = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const error = useSelector(Error);
    const course = useSelector(singleCourse);
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(getSingleCourse(id));
    }, [dispatch, id]);

    if (status === 'loading') return <div className="flex justify-center items-center h-96"><Spinner /></div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;
  
    console.log(course);
    
    return (
        <div className="min-h-screen max-w-5xl mt-5 mx-auto p-4">
            {/* Course Info */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="w-full flex flex-col md:flex-row justify-between gap-6">
                    {/* Course Info */}
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
                      {course?.ratings > 0 &&  <p><strong>Ratings:</strong> {course?.ratings}</p>}
                    </div>

                    {/* Instructor Info */}
                    <div className="w-full md:w-1/2">
                        <h2 className="text-xl font-semibold mb-4">Instructor(s)</h2>
                        {course?.instructor && course?.instructor.length > 0 ? (
                            course?.instructor.map((instructor, index) => (
                                <div onClick={()=>navigate(`/instructor/${instructor._id}`)} key={index} className="border rounded-md p-3 flex gap-3 items-center mb-4">
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
                </div>
            </div>

            {/* Services */}
            {course?.services && course?.services.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Services</h2>
                    <ul className="space-y-3">
                        {course?.services.map((service, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <h3 className="font-bold">{service.serviceName} ({service.vehicleType})</h3>
                                <p className="text-sm">{service.description}</p>
                                <p><strong>Price:</strong> ${service.price}</p>
                                <p><strong>Certificates Issued:</strong> {service.certificatesIssued.join(', ')}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Vehicles */}
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

            {/* Learners */}
            {course?.learners && course?.learners.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Learners</h2>
                    <ul className="space-y-3">
                        {course?.learners.map((learner, index) => (
                            <li key={index} className="flex gap-2 items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                               <img src={learner?.learner.avatar} alt="" className="w-12 h-12 rounded-full"/>
                               <div><h3 className="font-bold">{learner.learner?.name}</h3>
                                <p>Email: {learner.learner?.email}</p>
                                </div> 
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Reviews */}
            {course?.reviews && course?.reviews.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                    <ul className="space-y-3">
                        {course?.reviews.map((review, index) => (
                            <li key={index} className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                                <p>{review.comment}</p>
                                <p><strong>Rating:</strong> {review.rating} / 5</p>
                                <p><strong>Reviewer:</strong> {review.user.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CommonSingleCourse;
