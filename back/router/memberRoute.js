const express = require('express')
const calculatePrice = require('../DAO/calculatePrice.js')
const foodDAO = require('../DAO/foodDAO.js')
const trainDAO = require('../DAO/trainDAO.js')
const userDAO = require('../DAO/userDAO')
const ticketDAO = require('../DAO/ticketDAO.js')
const staffDAO = require('../DAO/staffDAO.js')

const router = express.Router()

router.route('/checkout').post(calculatePrice)
router.route('/addFood').post(foodDAO.add)
router.route('/getAllFood').get(foodDAO.showAllFood)
router.route('/updateFoodPrice').post(foodDAO.updatePrice)
router.route('/addTrain').post(trainDAO.add)




//User
router.route('/register').post(userDAO.register)
router.route('/login').post(userDAO.login)
router.route('/refund').post(userDAO.refund)
router.route('/user/showUserProfile').post(userDAO.showUserProfile)
router.route('/user/edit').post(userDAO.editProfile)
router.route('/user/confirmPassword').post(userDAO.confirmOldPassword)
router.route('/user/changePassword').post(userDAO.changePassword)
router.route('/user/forgot').post(userDAO.forgot)
router.route('/user/forgotChangePassword').post(userDAO.forgotChangePassword)


router.route('/booking').post(trainDAO.customerFindTrain)
router.route('/makeSeatLayout').post(ticketDAO.makeSeatLayout)
router.route('/addTicket').post(ticketDAO.addTicket)

//Staff
router.route('/staff/login').post(staffDAO.login)
router.route('/staff/register').post(staffDAO.register)
router.route('/staff/showTicket/:id').get(staffDAO.showTicket)
router.route('/staff/search').post(staffDAO.showReservTicket)
router.route('/staff/refund').post(staffDAO.viewRefund)
router.route('/staff/acceptRefund').post(staffDAO.acceptRefun)

// Test

router.route('/test').get(trainDAO.test)

// export default router
module.exports = router
