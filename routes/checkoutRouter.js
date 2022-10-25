const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const checkoutController = require("../controller/checkoutController");


router.use(protectedAuth);
router.post("/", checkoutController.checkout);

module.exports = router;