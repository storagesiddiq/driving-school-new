const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const drivingSchool = require('../controllers/drivingSchoolController');
const createMulterInstance = require('../utils/multerConfig');


// Create multer instance for 'category' uploads
const uploadAvatar = createMulterInstance('user');
const uploadBanner = createMulterInstance('banners');

//Routes for driving School manage
router.get('/get-my-school', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.getMySchool)
router.put('/update-my-school', isAuthenticatedUser, authorizeRoles('owner'),  drivingSchool.updateMySchool)
router.patch('/patch-my-school-avatar', isAuthenticatedUser, authorizeRoles('owner'), uploadAvatar.single('avatar'), drivingSchool.patchMySchoolAvatar);
router.patch('/patch-my-school-banner', isAuthenticatedUser, authorizeRoles('owner'),uploadBanner.single('bannerImg'), drivingSchool.patchMySchoolBanner);

//routes for instructor management
router.post('/create-instructor', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.createInstructor)
router.delete('/delete-instructor/:id', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.deleteInstructor)
router.get('/admin/instructors', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.getAllInstructors)
router.get('/admin/instructor/:id', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.getInstructorById)
router.put('/instructor/attendance/:id',isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.takeInstructorAttendance )

//routes for Register learners 
router.get('/registerLearners', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.getAllRegisteredLearners)
router.get('/registerLearner/:id', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.getRegisteredLearnerById)
router.put('/registerLearner/:id', isAuthenticatedUser, authorizeRoles('owner'), drivingSchool.updateRegisteredLearnerStatus)


module.exports = router