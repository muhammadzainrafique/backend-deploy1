const express = require("express");
const { authDoctor, authPaitent, logout, authAdmin } = require("../controllers/authController");
const router = express.Router();

router.route('/doctor').post(authDoctor)
router.route('/paitent').post(authPaitent)
router.route('/admin').post(authAdmin)
router.route('/logout').post(logout)
// router.route('/refresh').get(refresh)







module.exports = router;