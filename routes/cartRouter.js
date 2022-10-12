const router = require("express").Router();
const cartController = require("../controller/cartController");

router.get("/", cartController.createCart);

module.exports = router;