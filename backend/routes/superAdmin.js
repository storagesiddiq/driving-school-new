const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const SuperAdmin = require('../controllers/superAdminController')
const createMulterInstance = require('../utils/multerConfig');



//Routes for super admin
router.post('/admin/driving-school', isAuthenticatedUser, authorizeRoles('admin'), SuperAdmin.createDrivingSchool )
router.get('/admin/driving-schools', isAuthenticatedUser, authorizeRoles('admin'), SuperAdmin.getAllDrivingSchools )
router.get('/admin/driving-school/:id', isAuthenticatedUser, authorizeRoles('admin'), SuperAdmin.getDrivingSchoolById )
router.delete('/admin/driving-school/:id', isAuthenticatedUser, authorizeRoles('admin'), SuperAdmin.deleteDrivingSchool )
router.get('/admin/super-admin-analytics', isAuthenticatedUser, authorizeRoles('admin'), SuperAdmin.superAdminDashboard )


// Create multer instance for 'category' uploads
const uploadAvatar = createMulterInstance('defaultAvatar');
const uploadBanner = createMulterInstance('defaultBanner');

//defualt Avatar and default Banner
router.route('/admin/updateAvatar').put(isAuthenticatedUser,authorizeRoles('admin'), uploadAvatar.single('defaultAvatar'),SuperAdmin.updateDefaultAvatar )
router.route('/admin/updateBanner').put(isAuthenticatedUser,authorizeRoles('admin'), uploadBanner.single('defaultBanner'),SuperAdmin.updateDefaultBanner )

module.exports = router