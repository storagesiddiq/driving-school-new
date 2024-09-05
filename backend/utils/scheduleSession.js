const { Session } = require('../models/courseModel');
const Attendance = require('../models/attendanceModel');
const sendEmail = require('./email');
const UserModel = require('../models/UserModel');
const drivingSchoolModel = require('../models/drivingSchoolModel');

async function scheduleSession(sessionId) {
    const session = await Session.findById(sessionId).populate('course learner instructor');

    if (!session) {
        throw new Error('Session not found');
    }

    const { course, learner, instructor, startDate, startTime, endTime } = session;

    // Ensure that startDate, startTime, and endTime are properly converted to Date objects
    const startDateObj = new Date(startDate);
    const startTimeObj = new Date(`1970-01-01T${startTime}:00Z`);
    const endTimeObj = new Date(`1970-01-01T${endTime}:00Z`);

    // Calculate endDate based on course duration
    const endDate = new Date(startDateObj);
    endDate.setDate(endDate.getDate() + (course.duration * 7)); // course.duration is in weeks

    // Remove existing attendance records for the given session, learner, instructor, and course
    await Attendance.deleteMany({
        session: session._id,
    });

    // Automatically create or update attendance records for each session date
    let currentDate = new Date(startDateObj);
    while (currentDate <= endDate) {
        const attendanceRecord = new Attendance({
            session: session._id,
            date: new Date(currentDate.toISOString().split('T')[0]), // Match date only
            status: 'idle',
        });
        await attendanceRecord.save();

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const learnUser = await UserModel.findById(learner);
    const instUser = await UserModel.findById(instructor);
    const drivingSchool = await drivingSchoolModel.findById(course.drivingSchool);

    const formattedStartDate = startDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedStartTime = startTimeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedEndTime = endTimeObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const message = `
        Dear ${learnUser.name},

        Congratulations! Your session was successfully created by ${instUser.name}.

        Your Driving School classes will start from ${formattedStartDate} to ${formattedEndDate} from ${formattedStartTime} to ${formattedEndTime}.

        Best regards,
        The Driving School Team`;

    await sendEmail({
        email: learnUser.email,
        subject: `Your session was successfully created by ${instUser.name} for ${drivingSchool.drivingSchoolName} Driving School!`,
        message,
    });

    return { success: true, message: 'Attendance records processed successfully' };
}

module.exports = scheduleSession;
