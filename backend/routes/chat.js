const express = require('express')
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authentication');
const { accessChats, fetchChats } = require('../controllers/chatController');


router.route('/chat/:userId').post(isAuthenticatedUser, authorizeRoles('learner', 'instructor'), accessChats)
router.route('/chat').get(isAuthenticatedUser,authorizeRoles('learner', 'instructor'),fetchChats)

module.exports = router