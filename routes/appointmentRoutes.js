const  express = require("express");
const  {
  createAppointment,
  deleteAppointment,
  getAllAppointments,
  getAppointmentById,
  getAppointmentOfDoctor,
  getAppointmentOfPaitent,
  updateAppointent,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const router = express.Router();

router.route("/new").post(createAppointment);
router.route("/all").post(getAllAppointments);
router.route("/doctor/:id").get(getAppointmentOfDoctor);
router.route("/paitent/:id").get(getAppointmentOfPaitent);
router.route("/update-appointment-status/:id").patch(updateAppointmentStatus);
router.route("/:id").patch(updateAppointent);
router.route("/:id").get(getAppointmentById);
router.route("/:id").delete(deleteAppointment);

module.exports = router