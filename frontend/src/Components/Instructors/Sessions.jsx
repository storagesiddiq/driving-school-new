import React, { useEffect, useState } from 'react';
import { allSessions, Error, getAllSession, clearError, allAttenDates, getAllDates, takeAttendance, IsPatched, Status, clearPatched, AttStatus } from '../../slices/instructorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, Toast, Modal } from 'react-bootstrap';

const Sessions = () => {
    const dispatch = useDispatch();
    const status = useSelector(Status);
    const Attstatus = useSelector(AttStatus);
    const error = useSelector(Error);
    const sessions = useSelector(allSessions);
    const attendanceData = useSelector(allAttenDates);
    const isPatched = useSelector(IsPatched);

    const [selectedSession, setSelectedSession] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    // Dispatch the getAllSession action to fetch all sessions
    useEffect(() => {
        dispatch(getAllSession());
        if (error) {
            setToastMessage(error);
            setToastVariant('danger');
            setShowToast(true);
            dispatch(clearError());
        }
        if (isPatched) {
            setToastMessage("Successfully updated");
            setToastVariant('success');
            setShowToast(true);
            dispatch(clearPatched());
        }
    }, [dispatch, error, isPatched]);

    const handleAttendance = (id) => {
        dispatch(getAllDates(id));
        setModalVisible(true);
        setSelectedSession(id);
    };

    const toggleAttendanceStatus = (attendanceId, currentStatus) => {
        let newStatus;
        switch (currentStatus) {
            case 'Present':
                newStatus = 'Absent';
                break;
            case 'Absent':
                newStatus = 'idle';
                break;
            default:
                newStatus = 'Present';
                break;
        }
        dispatch(takeAttendance({ id: attendanceId, status: newStatus }));
    };

    useEffect(() => {
        if (selectedSession) {
            dispatch(getAllDates(selectedSession));
        }

    }, [selectedSession, isPatched]);

    return (
        <div className="container mt-12 mx-auto p-4">
            {status === 'loading' && (
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

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            {/* Sessions Table */}
            {status === 'succeeded' && sessions.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left">Learner Details</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Course Details</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(({ _id, learner, course, status: sessionStatus, startDate, startTime, endDate, endTime }, index) => (
                                <tr key={index} onClick={() => handleAttendance(_id)} className="hover:cursor-pointer hover:bg-gray-50">
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
                                            <span className=' text-sm'>{course.description}</span>
                                            <span className='text-sm'>{course.duration} week(s)</span>
                                        </div>
                                    </td>

                                    {/* Session Dates */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(startDate).toLocaleDateString()} -
                                        {new Date(endDate).toLocaleDateString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {startTime} - {endTime}
                                    </td>

                                    {/* Status */}
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${sessionStatus === 'Scheduled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {sessionStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Attendance Modal */}
            <Modal fullscreen="md-down" show={modalVisible} onHide={() => { setModalVisible(false); setSelectedSession(''); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Attendance Dates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                

                    {attendanceData.length > 0 ? (
                       <>  <div className="grid grid-cols-4 gap-2">
                            {attendanceData.map((att, index) => (
                               <div
                                    onClick={() => toggleAttendanceStatus(att._id, att.status)}
                                    className={`hover:cursor-pointer rounded-md ${att.status === "Present" ? 'bg-green-500' : att.status === "Absent" ? 'bg-red-800 text-white' : 'bg-gray-300'} flex flex-col items-center justify-center border border-gray-300 p-2 text-center`}
                                    key={index}
                                >
                                    <div className="text-lg font-bold">{att.formattedDate.Day}</div>
                                    <div className="text-sm">{att.formattedDate.Date} {att.formattedDate.Month}</div>
                                </div>
                            ))}
                        </div>
                            <div className="my-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 inline-block"></div>
                                <span>Present</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 inline-block"></div>
                                <span>Absent</span>
                            </div>
                        </div> </>
                    ) : (
                        <p>No attendance data available.</p>
                    )}
                </Modal.Body>
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

export default Sessions;
