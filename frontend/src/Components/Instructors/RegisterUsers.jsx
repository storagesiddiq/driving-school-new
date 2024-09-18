import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, ToastContainer, Toast } from 'react-bootstrap';
import { clearCreated, clearDeleted, clearError, clearUpdated, createSession, deleteSession, Error, getRegisteredUsers, getSingleSession, IsCreated, IsDeleted, IsUpdated, registeredUsers, singleSession, Status, updateSession } from '../../slices/instructorSlice';
import Spinner from '../../utils/Spinner';

const RegisterUsers = () => {
    const dispatch = useDispatch();
    const regUsers = useSelector(registeredUsers);
    const status = useSelector(Status);
    const error = useSelector(Error);
    const session = useSelector(singleSession);

    const isDeleted = useSelector(IsDeleted);
    const isCreated = useSelector(IsCreated);
    const isUpdated = useSelector(IsUpdated);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedLearner, setSelectedLearner] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [sessionData, setSessionData] = useState({
        startDate: '',
        startTime: '',
        endTime: ''
    });

    const [currentSessionId, setCurrentSessionId] = useState(null);

    const openModal = async (sessionStatus, learnerId, courseId) => {
        if (sessionStatus) {
            // Edit mode
            setIsEditMode(true);
            await dispatch(getSingleSession(sessionStatus));
            const sessionStartDate = new Date(session.startDate);
            sessionStartDate.setDate(sessionStartDate.getDate() + 1); // Add one day
            const updatedDate = sessionStartDate.toISOString().split('T')[0];
             
            setSessionData({
                startDate: updatedDate,
                startTime: session.startTime,
                endTime: session.endTime
            });
            setCurrentSessionId(sessionStatus);
        } else {
            // Create mode
            setSelectedCourse(courseId);
            setSelectedLearner(learnerId);
            setIsEditMode(false);
            setSessionData({
                startDate: '',
                startTime: '',
                endTime: ''
            });
        }
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            dispatch(updateSession({ sessionId: currentSessionId, data: sessionData }));
            console.log('Updating session:', currentSessionId, sessionData);
        } else {
            dispatch(createSession({ courseId: selectedCourse, data: { ...sessionData, learner: selectedLearner } }));
            console.log('Creating new session:', sessionData);
        }
    };

    useEffect(() => {
        dispatch(getRegisteredUsers());
    }, [dispatch, isCreated, isUpdated, isDeleted]);

    useEffect(() => {
        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
        if (isCreated) {
            setToastMessage('Session added successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
            handleClose();
        }
        if (isDeleted) {
            setToastMessage('Session deleted successfully!');
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearDeleted());
        }
        if (isUpdated) {
            setToastMessage('Session updated successfully!');
            setToastVariant('success');
            setShowToast(true);
            handleClose();
            dispatch(clearUpdated());
        }
    }, [error, isCreated, isUpdated, isDeleted, dispatch]);

    console.log(sessionData);

    return (
        <div className="container mt-16 mx-auto px-4">
       
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse border">
                    <thead>
                        <tr className="text-left bg-gray-100 border-b">
                            <th className="p-4">Learner</th>
                            <th className="p-4">Course</th>
                            <th className="p-4">Duration</th>
                            <th className="p-4">Session</th>
                        </tr>
                    </thead>
                    <tbody>
                        {regUsers.map(({ learner, course, sessionStatus }, index) => (
                            <tr key={index} className="hover:cursor-pointer border-b hover:bg-gray-50">
                                <td className="p-4 flex items-center space-x-4">
                                    <img
                                        src={learner.avatar}
                                        alt={learner.name}
                                        className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
                                    />
                                    <div>
                                        <h3 className="text-md font-semibold text-gray-700">{learner.name}</h3>
                                        <p className="text-sm text-gray-500">{learner.email}</p>
                                    </div>
                                </td>

                                <td className="p-4">
                                    <h4 className="text-md font-semibold text-primary">{course.title}</h4>
                                    <p className="text-sm text-gray-600">{course.description}</p>
                                </td>

                                <td className="p-4">
                                    <p className="text-sm text-gray-600">
                                        {course.duration} week(s)
                                    </p>
                                </td>

                                <td className="p-4 flex gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(sessionStatus, learner._id, course._id);
                                        }}
                                        className={`inline-block border px-3 py-1 rounded-full text-sm font-medium ${sessionStatus ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                    >
                                        {sessionStatus ? 'Edit' : 'Create'}
                                    </button>
                                    {sessionStatus && <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this session?')) {
                                                dispatch(deleteSession(sessionStatus))
                                            }
                                        }}
                                        className={`text-white inline-block border px-2 py-1 rounded-md text-sm font-medium bg-red-500`}
                                    >
                                        Delete
                                    </button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {status === 'loading' &&  (
                <div className="space-y-4">
                    {/* Skeleton Loader */}
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-300 rounded"></div>
                                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}


            <Modal fullscreen="md-down" centered show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Session' : 'Create Session'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formStartDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={sessionData.startDate}
                                onChange={(e) => setSessionData({ ...sessionData, startDate: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStartTime" className="mt-3">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={sessionData.startTime}
                                onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndTime" className="mt-3">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={sessionData.endTime}
                                onChange={(e) => setSessionData({ ...sessionData, endTime: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Button disabled={status === "loading"} variant="primary" type="submit" className="mt-4">
                           {status === "loading" ? <Spinner/> : isEditMode ? 'Update Session' : 'Create Session'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer position="top-center" className="p-3">
                <Toast bg={toastVariant} onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default RegisterUsers;
