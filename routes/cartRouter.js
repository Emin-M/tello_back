const router = require("express").Router();
const cartController = require("../controller/cartController");

router.get("/", cartController.createCart);
router.get("/:id", cartController.getCart);
router.post("/:id", cartController.addItemToCart);
router.put("/:cartId/items/:id", cartController.updateItemInCart);
router.delete("/:cartId/items/:id", cartController.deleteItemFromCart);
router.delete("/:id", cartController.deleteCart);
router.delete("/:id/items", cartController.emptyCart);

module.exports = router;