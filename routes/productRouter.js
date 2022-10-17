const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const specialAccess = require("../middlewares/specialAccess");
const productController = require("../controller/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);

router.use(protectedAuth, specialAccess);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;