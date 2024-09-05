const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Instructor = require('../controllers/instructorController');

//Get my instructor profile
router.get('/my-instructor-profile', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getMyProfile)

//Get all registered and approved by admin users of my associated course
router.get('/registered-users', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getAllRegUsersMyCourse)

//Managing Session by instructor
router.post('/session/:courseId', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.createSession)
router.get('/sessions/:courseId', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getAllSessions);       
router.get('/session/:sessionId', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getSession);            
router.put('/session/:sessionId', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.updateSession);         
router.delete('/session/:sessionId', isAuthenticatedUser, authorizeRoles('instructor'), Instructor.deleteSession); 


//patch Attendance
router.patch('/attendance/status/:id',isAuthenticatedUser, authorizeRoles('instructor'), Instructor.updateAttendance)
router.get('/attendance/:sessionId',isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getAttendances)

//create and sendMail report to leanrner
router.post('/report/:sessionId',isAuthenticatedUser, authorizeRoles('instructor'), Instructor.createReport)
router.get('/reports',isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getAllReports)
router.get('/report/:reportId',isAuthenticatedUser, authorizeRoles('instructor'), Instructor.getSingleReport)


module.exports = router
