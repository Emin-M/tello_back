const router = require("express").Router();
const cartController = require("../controller/cartController");

router.get("/", cartController.createCart);
router.get("/:id", cartController.getCart);

module.exports = router;