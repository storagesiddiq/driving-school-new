const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Vehicle = require('../controllers/vehicleController')


router.post('/create-vehicle', isAuthenticatedUser, authorizeRoles('owner'), Vehicle.createVehicle)
router.get('/vehicles', isAuthenticatedUser, authorizeRoles('owner'), Vehicle.getAllVehicles)
router.get('/vehicle/:id', isAuthenticatedUser, authorizeRoles('owner'), Vehicle.getVehicleById)
router.put('/vehicle/:id', isAuthenticatedUser, authorizeRoles('owner'), Vehicle.updateVehicle)
router.delete('/vehicle/:id', isAuthenticatedUser, authorizeRoles('owner'), Vehicle.deleteVehicle)

module.exports = router