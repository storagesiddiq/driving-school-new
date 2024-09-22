const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Course = require('../controllers/courseController');
const createMulterInstance = require('../utils/multerConfig');

const upload = createMulterInstance('course');


router.get('/get-courses', isAuthenticatedUser, authorizeRoles('owner'), Course.getAllCourses)
router.post('/create-course', isAuthenticatedUser,upload.single('image'), authorizeRoles('owner'),  Course.createCourse)
router.get('/get-course/:id', isAuthenticatedUser, authorizeRoles('owner'), Course.getCourseById)
router.delete('/course/:id', isAuthenticatedUser, authorizeRoles('owner'), Course.deleteCourse)
router.put('/course/:id', isAuthenticatedUser,upload.single('image'), authorizeRoles('owner'), Course.updateCourse)


module.exports = router

