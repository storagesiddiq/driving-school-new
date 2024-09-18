import React, { useEffect, useState } from 'react';
import {
    allSessions, Error, getAllSession, clearError, Status, generateReport, IsCreated, clearCreated,
    ReportStatus, ReportError, sinlgeReport, allReports, getAllReports,
    getSingleReport
} from '../../slices/instructorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, Toast, Modal, Button } from 'react-bootstrap';
import Spinner from '../../utils/Spinner';

const Report = () => {
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const error = useSelector(Error);
    const sessions = useSelector(allSessions);
    const isCreated = useSelector(IsCreated);
    const reports = useSelector(allReports);
    const singleReport = useSelector(sinlgeReport);

    const reportStatus = useSelector(ReportStatus);
    const reportError = useSelector(ReportError);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        dispatch(getAllSession());
        dispatch(getAllReports());

        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }

        if (isCreated) {
            setToastMessage("Report Created and sent to Learner's Email successfully!");
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearCreated());
        }

        if (reportError) {
            setToastMessage(reportError);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
    }, [dispatch, isCreated, error, reportError]);

    // Open modal and show report details
    const handleViewReport = (sessionId) => {
        dispatch(getSingleReport(sessionId))
        setSelectedReport(singleReport);
        setShowModal(true);
    };

    console.log(singleReport);

    return (
        <div className="container mt-12 mx-auto p-4">
            {status === 'loading' && (
                <div className="space-y-4">
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

            {status === 'succeeded' && sessions.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Learner Details</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Course Details</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(({ _id, learner, course, status: sessionStatus, startDate, startTime, endDate, endTime }, index) => (
                                <tr key={index} className=" hover:bg-gray-50">
                                    {/* Learner Details */}
                                    <td className="border border-gray-300 px-4">
                                        <div className='flex gap-2'>
                                            <img
                                                src={learner.avatar}
                                                alt={learner.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className='flex flex-col'>
                                                <span>{learner.name}</span>
                                                <span>{learner.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Course Details */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className='flex flex-col gap-1'>
                                            <span className='font-semibold text-md'>{course.title}</span>
                                            <span className='text-sm'>{course.description}</span>
                                            <span className='text-sm'>{course.duration} week(s)</span>
                                        </div>
                                    </td>

                                    {/* Session Dates */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {startTime} - {endTime}
                                    </td>



                                    {/* View Report */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className='flex gap-3'> <button onClick={() => dispatch(generateReport(_id))}
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                                                ${sessionStatus === 'Scheduled' ? 'bg-blue-500 text-white' : ''}
                                                ${sessionStatus === 'Completed' ? 'bg-green-500 text-white' : ''}
                                                ${sessionStatus === 'Cancelled' ? 'bg-red-500 text-white' : ''}`}
                                            disabled={sessionStatus !== 'Completed' || reportStatus === "loading"}
                                        >
                                            {reportStatus === "loading" ? <Spinner /> : sessionStatus === 'Completed' ? "Generate" : sessionStatus}
                                        </button>
                                            {reports.some(report => report.session._id === _id) && (
                                                <button
                                                    onClick={() => handleViewReport(reports.find(report => report.session._id === _id)._id)}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                                >
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Report */}
            <Modal
            centered
            fullscreen="md-down"
            show={showModal}
            onHide={() => setShowModal(false)}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Report Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedReport ? (
                    <div className="container-fluid">
                        {/* Learner Details */}
                        <div className="row mb-4">
                            <div className="col-md-4 text-center">
                                <img
                                    src={selectedReport.session.learner.avatar}
                                    alt={selectedReport.session.learner.name}
                                    className="img-fluid rounded-circle"
                                    style={{ width: '120px', height: '120px' }}
                                />
                            </div>
                            <div className="col-md-8">
                                <h5>Learner Information</h5>
                                <p><strong>Name:</strong> {selectedReport.session.learner.name}</p>
                                <p><strong>Email:</strong> {selectedReport.session.learner.email}</p>
                            </div>
                        </div>

                        {/* Course Details */}
                        <div className="mb-4">
                            <h5>Course Information</h5>
                            <p><strong>Title:</strong> {selectedReport.session.course.title}</p>
                            <p><strong>Price:</strong> ${selectedReport.session.course.price}</p>
                            <p><strong>Duration:</strong> {selectedReport.session.course.duration} week(s)</p>
                        </div>

                        {/* Session Details */}
                        <div className="mb-4">
                            <h5>Session Information</h5>
                            <p><strong>Start Date:</strong> {new Date(selectedReport.session.startDate).toLocaleDateString()}</p>
                            <p><strong>End Date:</strong> {new Date(selectedReport.session.endDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {selectedReport.session.startTime} - {selectedReport.session.endTime}</p>
                        </div>

                        {/* Report Details */}
                        <div>
                            <h5>Report Completion Status</h5>
                            <p><strong>Completion Status:</strong> {selectedReport.completionStatus}</p>
                            <p><strong>Report Created At:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <p>No report found for this session.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>


            {/* Toast Container */}
            <ToastContainer position="top-end" className="p-3">
                <Toast show={showToast} bg={toastVariant} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Report;
