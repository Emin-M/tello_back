const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const orderController = require("../controller/orderController");

router.use(protectedAuth);
router.get("/", orderController.getOrders);

module.exports = router;