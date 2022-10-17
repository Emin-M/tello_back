const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const authController = require("../controller/authController");
const userController = require("../controller/userController");

router.post("/", authController.signup);
router.post("/email-token", authController.emailToken);
router.post("/exchange-token", authController.exchangeToken);

router.use(protectedAuth);
router.get("/", userController.getUser);
router.put("/", userController.updateUser);
router.delete("/", userController.deleteUser);

module.exports = router;