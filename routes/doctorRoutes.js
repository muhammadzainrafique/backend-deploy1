const express = require("express");
const {
  createNewDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getDoctor,
} = require("../controllers/doctorController");

const router = express.Router();

router.route("/register").post(createNewDoctor);
router.route("/getDoctor/:id").get(getDoctor);
router.route("/all").get(getAllDoctor);
router.route("/:id").patch(updateDoctor);
router.route("/:id").delete(deleteDoctor);

module.exports = router;
