import React, { useEffect, useState } from 'react';
import { addCourse, allCourses, allInstructors, clearCreated, clearDeleted, clearError, clearUpdated, deleteCourse, Error, getAllCourses, getAllInstructors, IsCreated, IsDeleted, IsUpdated, Status, updateCourse } from '../../slices/ownerSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import Spinner from '../../utils/Spinner';
import Select from 'react-select';
import { FaEdit } from 'react-icons/fa';
import { allVehicles, getAllVehicles } from '../../slices/vehicleSlice';
import { allServices, getAllServices } from '../../slices/serviceSlice';

const Courses = () => {
    const dispatch = useDispatch();
    const courses = useSelector(allCourses);
    const instructors = useSelector(allInstructors);
    const vehicles = useSelector(allVehicles);
    const services = useSelector(allServices);

    const status = useSelector(Status);
    const error = useSelector(Error);
    const isCreated = useSelector(IsCreated);
    const isDeleted = useSelector(IsDeleted);
    const isUpdated = useSelector(IsUpdated);

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        price: 0,
        vehicles: [],
        services: [],
        description: '',
        duration: '',
        instructor: [],
        image: null,
        imagePreview: null,
    });
    const [selectedCourse, setSelectedCourse] = useState(null);


    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const [vehiclesOptions, setVehiclesOptions] = useState([]);
    const [servicesOptions, setServicesOptions] = useState([]);
    const [instructorOptions, setInstructorOptions] = useState([]);

    useEffect(() => {
        dispatch(getAllCourses());
        dispatch(getAllInstructors());
        dispatch(getAllVehicles());
        dispatch(getAllServices());

    }, [dispatch, isCreated, isDeleted, isUpdated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevState) => ({
                ...prevState,
                image: file,
                imagePreview: URL.createObjectURL(file),
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const FormDataValue = new FormData()
        FormDataValue.append('title', formData.title);
        FormDataValue.append('description', formData.description);
        FormDataValue.append('duration', formData.duration);
        FormDataValue.append('price', formData.price);
        formData.instructor?.forEach((instructor) => FormDataValue.append('instructor[]', instructor));
        formData.vehicles?.forEach((vehicle) => FormDataValue.append('vehicles[]', vehicle));
        formData.services?.forEach((service) => FormDataValue.append('services[]', service));
        if (formData.image) {
            FormDataValue.append('image', formData.image); // Append the image file
        }
        dispatch(addCourse(FormDataValue));
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

    const handleServiceChange = (selectedOptions) => {
        setFormData({
            ...formData,
            services: selectedOptions ? selectedOptions.map(option => option.value) : [] // Extracting IDs
        });
    };

    const handleVehicleChange = (selectedOptions) => {
        setFormData({
            ...formData,
            vehicles: selectedOptions ? selectedOptions.map(option => option.value) : [] // Extracting IDs
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
            setToastMessage('added successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
            setShowModal(false);
            setFormData({ name: '', email: '', phoneNumber: '' });
        }
        if (isDeleted) {
            setToastMessage('deleted successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearDeleted());
        }
        if (isUpdated) {
            setToastMessage('updated successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearUpdated());
            setShowModal2(false)
        }
    }, [error, isCreated, isUpdated, isDeleted, dispatch]);

    const handleClick = (id) => {
        navigate(`/owner/course/${id}`);
    };

    const handleAddButton = () => {
        setShowModal(true);

    };

    // Use useEffect to set instructor options when 'instructors' state changes
    useEffect(() => {
        if (instructors && instructors.length > 0) {
            setInstructorOptions(
                instructors.map(instructor => ({
                    value: instructor.instructor._id,
                    label: instructor.instructor.name,
                }))
            );
        }
        if (vehicles && vehicles.length > 0) {
            setVehiclesOptions(
                vehicles.map(vehicle => ({
                    value: vehicle._id,
                    label: vehicle.name,
                }))
            );
        }
        if (services && services.length > 0) {
            setServicesOptions(
                services.map(service => ({
                    value: service._id,
                    label: service.serviceName,
                }))
            );
        }
    }, [instructors, services, vehicles]);

    const handleUpdate = (course) => {
        setFormData({ ...course, imagePreview: course.image });
        setSelectedCourse(course);
        setShowModal2(true);
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault()
        dispatch(updateCourse({ id: selectedCourse._id, data: formData }));
    }

    console.log(formData);


    return (
        <div className="container mt-4">
            <h1 className="my-2 text-xl font-semibold">Courses</h1>
            <div className="flex justify-end gap-3">
                <Button onClick={handleAddButton} className="mb-3">Add</Button>
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
                        <div onClick={() => handleClick(course._id)}
                            key={course._id}
                            className="hover:cursor-pointer w-full my-2 flex flex-col sm:flex-row justify-between border shadow-sm p-4 rounded-md mb-4"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-1/2">
                                <img
                                    src={course?.image}
                                    width="120px" // Rectangle width
                                    height="60px" // Rectangle height
                                    className="rounded-md border"
                                    style={{ objectFit: 'cover', display: 'block', height: '60px', width: '120px' }} // Ensure fixed size
                                    alt="Course Avatar"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-700">{course.title}</p>
                                    <p className="text-xs text-gray-500">{course.price}</p>
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(getAllInstructors());
                                        dispatch(getAllVehicles());
                                        dispatch(getAllServices());
                                        handleUpdate(course);
                                    }}
                                    className="p-2 w-auto h-auto border rounded-md  hover:bg-blue-600 text-white-700 hover:text-white transition-all duration-300 ease-in-out"
                                >
                                    <FaEdit />
                                </button>

                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(course._id); }}
                                    className="p-2   w-auto h-auto border rounded-md  hover:bg-red-600 text-white-700 hover:text-white transition-all duration-300 ease-in-out"
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
                            <Form.Label>Course Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange} // Handle image selection
                            />
                            {formData.imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Selected Course"
                                        style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>

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
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                placeholder="Enter price"
                                value={formData.price}
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
                            <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={vehiclesOptions}
                                value={vehiclesOptions.filter(option => formData.vehicles?.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleVehicleChange} // Handle change
                                placeholder="Select Vehicles..."
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Services</Form.Label>
                            <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={servicesOptions}
                                value={servicesOptions.filter(option => formData.services?.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleServiceChange} // Handle change
                                placeholder="Select Services..."
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructor</Form.Label>
                            <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={instructorOptions}
                                value={instructorOptions.filter(option => formData.instructor?.includes(option.value))} // Pre-select instructors based on IDs
                                onChange={handleInstructorChange} // Handle change
                                placeholder="Select instructors..."
                            />

                        </Form.Group>

                        <Button disabled={status === 'loading'} variant="primary" type="submit">
                            {status === 'loading' ? <Spinner /> : 'Add'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Update model */}
            {setSelectedCourse && <Modal centered fullscreen="md-down" show={showModal2} onHide={() => setShowModal2(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Course Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange} // Handle image selection
                            />
                            {formData.imagePreview && (
                                <div className="mt-3">
                                    <img
                                        src={formData.imagePreview}
                                        alt="Selected Course"
                                        style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                        </Form.Group>

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
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="text"
                                name="price"
                                placeholder="Enter Price"
                                value={formData.price}
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
                            <Select
                                isMulti // Enables multi-select
                                name="vehicles"
                                options={vehiclesOptions}
                                value={vehiclesOptions.filter(opt =>
                                    formData.vehicles?.some(vehicle => vehicle._id === opt.value)
                                )}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(opt => ({
                                        _id: opt.value, // Assuming each option's `value` holds the `_id`
                                        name: opt.label, // Assuming the name or label is in `label`
                                    }));
                                    setFormData(prev => ({
                                        ...prev,
                                        vehicles: selectedValues
                                    }));
                                }}
                                placeholder="Select Vehicles..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Services</Form.Label>
                            <Select
                                isMulti // Enables multi-select
                                name="services"
                                options={servicesOptions}
                                value={servicesOptions.filter(opt =>
                                    formData.services?.some(ser => ser._id === opt.value)
                                )}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(opt => ({
                                        _id: opt.value,
                                        name: opt.label
                                    }));
                                    setFormData(prev => ({
                                        ...prev,
                                        services: selectedValues
                                    }));
                                }}
                                placeholder="Select Services..."
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructor</Form.Label>
                            <Select
                                isMulti // Enables multi-select
                                name="instructor"
                                options={instructorOptions}
                                value={instructorOptions.filter(opt =>
                                    formData.instructor?.some(inst => inst._id === opt.value)
                                )}
                                onChange={(selectedOptions) => {
                                    const selectedValues = selectedOptions.map(opt => ({
                                        _id: opt.value,
                                        name: opt.label
                                    }));
                                    setFormData(prev => ({
                                        ...prev,
                                        instructor: selectedValues
                                    }));
                                }}
                                placeholder="Select Instructors..."
                            />
                        </Form.Group>

                        <Button disabled={status === 'loading'} variant="primary" type="submit">
                            {status === 'loading' ? <Spinner /> : 'Update'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>}

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
