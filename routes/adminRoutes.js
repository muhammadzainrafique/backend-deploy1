const express = require("express");
const {
    createNewAdmin,
    getAllAdmin,
    getAdmin,
    updateAdmin,
    deleteAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.route("/register").post(createNewAdmin);
router.route("/getAdmin/:id").get(getAdmin);
router.route("/all").get(getAllAdmin);
router.route("/:id").patch(updateAdmin);
router.route("/:id").delete(deleteAdmin);

module.exports = router;
