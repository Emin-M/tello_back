const router = require("express").Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");

router.post("/", authController.signup);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;