const router = require("express").Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");

router.get("/:id", userController.getUser);
router.post("/", authController.signup);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;