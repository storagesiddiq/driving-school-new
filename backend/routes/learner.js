const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Learner = require('../controllers/learnerController');

//Apply Courses and remove Apply courses
router.post('/apply-course/:course', isAuthenticatedUser, authorizeRoles('learner'), Learner.createRegistration); 
router.put('/review/:courseId', isAuthenticatedUser, authorizeRoles('learner'), Learner.giveReview); 

router.get('/my-courses', isAuthenticatedUser, authorizeRoles('learner'), Learner.getMyCourses)
router.get('/my-sessions', isAuthenticatedUser, authorizeRoles('learner'), Learner.getLearnerSessions)
router.get('/my-session-attendance/:sessionId', isAuthenticatedUser, authorizeRoles('learner'), Learner.getLearnerAttendance)

module.exports = router
