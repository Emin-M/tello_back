const router = require("express").Router();
const categoryController = require("../controller/categoryController");
const protectedAuth = require("../middlewares/protectedAuth");
const specialAccess = require("../middlewares/specialAccess");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

router.use(protectedAuth, specialAccess);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;