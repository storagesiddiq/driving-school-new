const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Common = require('../controllers/commonController');


router.get('/driving-schools', isAuthenticatedUser, Common.getAllDrivingSchools)
router.get('/driving-school/:id', isAuthenticatedUser, Common.getDrivingSchoolById)
router.get('/instructors', isAuthenticatedUser, Common.getAllInstructors)
router.get('/instructor/:id', isAuthenticatedUser, Common.getSingleInstructorById)
router.get('/courses', isAuthenticatedUser, Common.getAllCourses)
router.get('/course/:id', isAuthenticatedUser, Common.getSingleCourse)



module.exports = router

