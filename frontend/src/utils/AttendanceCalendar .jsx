import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { takeInstructorAttendance, IsUpdated, getSingleInstructor, clearUpdated } from '../slices/ownerSlice';
import { useDispatch, useSelector } from 'react-redux';

const AttendanceCalendar = ({isAdmin, id, attendaceData, fromDate, totalAttendanceDays, totalPresentDays }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const isUpdated = useSelector(IsUpdated)
    const dispatch = useDispatch()
    console.log(fromDate);
    

    const onDateClick = (date) => {
        setSelectedDate(date);
        setModalOpen(true); // Open the modal to mark attendance
    };

    // Convert attendanceData to a format that can be used to highlight dates
    const getHighlightedDates = () => {
        return attendaceData && attendaceData.reduce((acc, item) => {
            const date = new Date(item.date).toDateString();
            acc[date] = item.status;
            return acc;
        }, {});
    };
    const highlightedDates = getHighlightedDates();

    const markAttendance = (status) => {
        const dateStr =  selectedDate.toDateString()
      
        const obj = {
            "date": selectedDate.toDateString(),
            status
        }
        console.log(obj);
        
        console.log(`${id} Attendance for ${selectedDate.toDateString()}: ${status}`);
        dispatch(takeInstructorAttendance({id, obj}))
        setModalOpen(false);
    };

    useEffect(() => {
        if (isUpdated) {
            setModalOpen(false);
            dispatch(getSingleInstructor(id))
            dispatch(clearUpdated())
        }
    }, [isUpdated])

    const minDate = new Date(fromDate);

    // Function to apply styles to dates based on their status
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toDateString();
            if (attendaceData && highlightedDates[dateString]) {
                return highlightedDates[dateString] === 'Present'
                    ? 'bg-green-500 text-white rounded-full'
                    : 'bg-red-500 text-white rounded-full';
            }
        }
        return null;
    };

    console.log(isUpdated);

    return (
        <div className="border-2 pt-10 p-4 mx-auto max-w-4xl">
            <h2 className="text-center text-2xl mb-6 font-semibold">Attendance Calendar</h2>

            <div className="flex flex-col items-center justify-between space-y-6 lg:space-y-0 lg:space-x-6">
                {/* Calendar */}
                <div className="w-full">
                    <Calendar
                        onClickDay={isAdmin ? onDateClick : ''}
                        minDate={minDate}
                        tileClassName={tileClassName}
                    />
                </div>

                {/* Attendance Summary */}
           {isAdmin && <div className="mt-3 w-full flex flex-col items-start justify-center bg-gray-100 p-4 rounded shadow-md">
                    <p className="text-lg mb-2">Total Days: <span className="font-bold">{totalAttendanceDays}</span></p>
                    <p className="text-lg mb-2">Start Date: <span className="font-bold">{fromDate}</span></p>
                    <p className="text-lg mb-2">Present Days: <span className="font-bold">{totalPresentDays}</span></p>
                    <p className="text-lg mb-2">Absent Days: <span className="font-bold">{totalAttendanceDays - totalPresentDays}</span></p>
                </div>}
            </div>

            {/* Modal for marking attendance */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Mark Attendance for {selectedDate.toDateString()}</h3>
                        <div className="flex space-x-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                onClick={() => markAttendance('Present')}>
                                Present
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                onClick={() => markAttendance('Absent')}>
                                Absent
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceCalendar;
