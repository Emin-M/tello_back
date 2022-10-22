const router = require("express").Router();
const cartController = require("../controller/cartController");

router.get("/", cartController.createCart);
router.post("/:id", cartController.addItemToCart);
router.get("/:id", cartController.getCart);
router.delete("/:id", cartController.deleteCart);
router.delete("/:id/items", cartController.emptyCart);

module.exports = router;