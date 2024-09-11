import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import {
    allInstructors,
    Error,
    getAllInstructors,
    Status,
    addInstructor,
    clearCreated,
    clearError,
    IsCreated,
    clearDeleted,
    IsDeleted,
    deleteInstructor
} from '../../slices/ownerSlice';
import Spinner from '../../utils/Spinner';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const Instructors = () => {
    const dispatch = useDispatch();
    const instructors = useSelector(allInstructors);
    const status = useSelector(Status);
    const error = useSelector(Error);
    const isCreated = useSelector(IsCreated);
    const isDeleted = useSelector(IsDeleted);

    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '' });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    useEffect(() => {
        dispatch(getAllInstructors());
    }, [dispatch, isCreated, isDeleted]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [errors, setErrors] = useState({
        apiError: '',
        name: '',
        email: '',
        phoneNumber: '',
    });

    const validateForm = () => {
        const newErrors = {
            apiError: '',
            name: '',
            email: '',
            phoneNumber: '',
        };

        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';

        setErrors(prev => ({ ...prev, ...newErrors }));
        return !Object.values(newErrors).some(error => error);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(addInstructor(formData));
        }
    };

    const handleClick = (id) => {
        navigate(`/owner/instructor/${id}`);
    };

    const handleDelete = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this instructor?');
        if (isConfirmed) {
            dispatch(deleteInstructor(id));
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="my-2 text-xl font-semibold">Instructors</h1>

            {/* Add Instructor Button */}
            <div className="flex justify-end gap-3">
                <Button onClick={() => setShowModal(true)} className="mb-3">
                    Add
                </Button>
            </div>

            {/* Instructors List */}
            {status === 'loading' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((skeleton) => (
                        <div key={skeleton} className="animate-pulse flex flex-col bg-white p-6 rounded-lg shadow-md">
                            <div className="h-6 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : instructors.length > 0 ? (
                <ul className="list-group">
                    {instructors.map((instructor) => (
                        <div
                            onClick={() => handleClick(instructor._id)}
                            key={instructor._id}
                            className="hover:cursor-pointer border shadow-sm p-4 justify-between rounded-md flex items-center gap-4 mb-4"
                        >
                            <div className="flex items-center gap-2">
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
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(instructor?._id);
                                }}
                                className="p-2 border rounded-md bg-red-300 hover:bg-red-600 text-red-700 hover:text-white"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                </ul>
            ) : (
                <p>No Instructors found</p>
            )}

            {/* Add Instructor Modal */}
            <Modal centered fullscreen="md-down" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Instructor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter instructor's name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter instructor's email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                placeholder="Enter instructor's phone number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        {errors.apiError && (
                            <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="text-white w-full mt-3 px-3 py-2 bg-primary-dark rounded-md transition duration-300 ease-in-out hover:shadow-lg transform hover:scale-105"
                        >
                            {status === 'loading' ? <Spinner /> : 'ADD INSTRUCTOR'}
                        </button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Toast Notification */}
            <ToastContainer position="top-end" className="p-3">
                <Toast
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Instructors;
