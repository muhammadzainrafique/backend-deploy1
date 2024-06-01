const express = require("express");
const {
  createNewPaitent,
  updatePaitent,
  deletePaitent,
  getAllPaitent,
  getPaitent,
} = require("../controllers/paitentController");

const router = express.Router();

router.route("/register").post(createNewPaitent);
router.route("/getPaitent/:id").get(getPaitent);
router.route("/all").get(getAllPaitent);
router.route("/:id").patch(updatePaitent);
router.route("/:id").delete(deletePaitent);

module.exports = router;
