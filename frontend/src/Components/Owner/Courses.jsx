import React, { useEffect, useState } from 'react';
import { addCourse, allCourses, allInstructors, clearCreated, clearDeleted, clearError, deleteCourse, Error, getAllCourses, getAllInstructors, IsCreated, IsDeleted, Status } from '../../slices/ownerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import Spinner from '../../utils/Spinner';
import Select from 'react-select';

const Courses = () => {
    const dispatch = useDispatch();
    const courses = useSelector(allCourses);
    const instructors = useSelector(allInstructors);
    const status = useSelector(Status);
    const error = useSelector(Error);
    const isCreated = useSelector(IsCreated);
    const isDeleted = useSelector(IsDeleted);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        vehicles: [],
        services: [],
        description: '',
        duration: '',
        instructor: [] // Store instructor IDs here
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const [vehiclesOptions, setVehiclesOptions] = useState([]);
    const [servicesOptions, setServicesOptions] = useState([]);
    const [instructorOptions, setInstructorOptions] = useState([]);

    useEffect(() => {
        dispatch(getAllCourses());
        dispatch(getAllInstructors());
        setInstructorOptions(instructors.map(instructor => ({
            value: instructor.instructor._id,
            label: instructor.instructor.name,
        })));
        // setVehiclesOptions(vehicles.map(veh => ({
        //     value: instructor.instructor._id,
        //     label: instructor.instructor.name,
        // })))
        // setServicesOptions(services.map(ser => ({
        //     value: instructor.instructor._id,
        //     label: instructor.instructor.name,
        // })))

    }, [dispatch, isCreated, isDeleted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addCourse(formData));
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this course?');
        if (isConfirmed) {
            dispatch(deleteCourse(id));
        }
    };

    const handleInstructorChange = (selectedOptions) => {
        setFormData({
            ...formData,
            instructor: selectedOptions ? selectedOptions.map(option => option.value) : [] // Extracting IDs
        });
    };

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
        if (isCreated) {
            setToastMessage('Instructor added successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
            setShowModal(false);
            setFormData({ name: '', email: '', phoneNumber: '' });
        }
        if (isDeleted) {
            setToastMessage('Instructor deleted successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearDeleted());
        }
    }, [error, isCreated, isDeleted, dispatch]);

    const handleClick = (id) => {
        navigate(`/owner/course/${id}`);
    };

    return (
        <div className="container mt-4">
            <h1 className="my-2 text-xl font-semibold">Courses</h1>

            <div className="flex justify-end gap-3">
                <Button onClick={() => setShowModal(true)} className="mb-3">Add</Button>
            </div>

            {status === 'loading' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Loading skeleton */}
                    {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                        <div key={skeleton} className="animate-pulse flex flex-col bg-white p-6 rounded-lg shadow-md">
                            <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {courses.map((course) => (
                        <div onClick={()=>handleClick(course._id) }
                            key={course._id}
                            className="hover:cursor-pointer w-full my-2 flex flex-col sm:flex-row justify-between border shadow-sm p-4 rounded-md mb-4"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-1/2">
                                <img
                                    src={course.drivingSchool.avatar}
                                    width="50"
                                    height="50"
                                    className="rounded-full"
                                    alt="Course Avatar"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">{course.title}</p>
                                    <p className="text-xs text-gray-500">{course.description}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center w-full sm:w-1/2 mt-2 sm:mt-0 sm:pl-4">
                                <div className="flex flex-col">
                                    <p><strong>Instructor:</strong> {course.instructor[0]?.name}</p>

                                    {course.ratings > 0 && (
                                        <p><strong>Rating:</strong> {course.ratings}</p>
                                    )}
                                    {course.reviews.length > 0 && (
                                        <p><strong>Reviews:</strong> {course.reviews.length}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(course._id)}
                                    className="p-2 w-auto h-auto border rounded-md bg-red-300 hover:bg-red-600 text-red-700 hover:text-white transition-all duration-300 ease-in-out"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            <Modal centered fullscreen="md-down" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter course title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                placeholder="Enter course description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Duration (in weeks)</Form.Label>
                            <Form.Control
                                type="number"
                                name="duration"
                                placeholder="Enter duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Vehicles</Form.Label>
                            {/* <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={instructorOptions }
                                value={instructorOptions.filter(option => formData.instructor.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleInstructorChange} // Handle change
                                placeholder="Select instructors..."
                            />
                            <div>
                                Selected Instructor IDs: {formData.instructor.join(', ')}
                            </div> */}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Services</Form.Label>
                            {/* <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={instructorOptions }
                                value={instructorOptions.filter(option => formData.instructor.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleInstructorChange} // Handle change
                                placeholder="Select instructors..."
                            />
                            <div>
                                Selected Instructor IDs: {formData.instructor.join(', ')}
                            </div> */}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructor</Form.Label>
                            <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={instructorOptions }
                                value={instructorOptions.filter(option => formData.instructor?.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleInstructorChange} // Handle change
                                placeholder="Select instructors..."
                            />
                            <div>
                                Selected Instructor IDs: {formData.instructor?.join(', ')}
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Add Course
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer className="p-3" position="top-end">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    bg={toastVariant}
                    autohide
                    delay={5000}
                >
                    <Toast.Header>
                        <strong className="me-auto">Course Manager</strong>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Courses;
