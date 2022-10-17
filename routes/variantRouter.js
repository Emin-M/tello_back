const router = require("express").Router({
    mergeParams: true
});
const protectedAuth = require("../middlewares/protectedAuth");
const specialAccess = require("../middlewares/specialAccess");
const variantController = require("../controller/variantController");

router.get("/", variantController.getAllvariants);
router.get("/:id", variantController.getVariant);

// router.post("/", variantController.createProduct);
// router.patch("/:id", variantController.updateProduct);
// router.delete("/:id", variantController.deleteProduct);

module.exports = router;