const express = require('express')
const router = express.Router()
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authentication');
const { sendMessage, allMessages } = require('../controllers/messageController');


router.route('/send-msg').post(isAuthenticatedUser,authorizeRoles('learner', 'instructor'), sendMessage)
router.route('/all-msg/:chatId').get(isAuthenticatedUser, authorizeRoles('learner', 'instructor'),allMessages)

module.exports = router