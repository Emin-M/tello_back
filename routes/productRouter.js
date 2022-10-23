const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const specialAccess = require("../middlewares/specialAccess");
const productController = require("../controller/productController");
const variantRouter = require("./variantRouter");
const reviewRouter = require("./reviewRouter");

//! merged routes
router.use("/:id/variants", variantRouter);
router.use("/:id/reviews", reviewRouter);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getOneProduct);

router.use(protectedAuth, specialAccess);
router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;