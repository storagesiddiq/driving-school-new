const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Service = require('../controllers/serviceController')


router.post('/create-service', isAuthenticatedUser, authorizeRoles('owner'), Service.createService)
router.get('/services', isAuthenticatedUser, authorizeRoles('owner'), Service.getAllServices)
router.get('/service/:id', isAuthenticatedUser, authorizeRoles('owner'), Service.getServiceById)
router.put('/service/:id', isAuthenticatedUser, authorizeRoles('owner'), Service.updateService)
router.delete('/service/:id', isAuthenticatedUser, authorizeRoles('owner'), Service.deleteService)

module.exports = router