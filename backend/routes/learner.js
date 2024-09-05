const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authentication')
const express = require('express')
const router = express.Router()
const Learner = require('../controllers/learnerController');

//Apply Courses and remove Apply courses
router.post('/apply-course/:course', isAuthenticatedUser, authorizeRoles('learner'), Learner.createRegistration); 
router.put('/review/:courseId', isAuthenticatedUser, authorizeRoles('learner'), Learner.giveReview); 


module.exports = router
