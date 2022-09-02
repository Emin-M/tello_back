const router = require("express").Router();
const productController = require("../controller/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);
router.post("/", productController.createProduct);

module.exports = router;