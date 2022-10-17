const router = require("express").Router();
const assetController = require("../controller/assetController");
const protectedAuth = require("../middleware/protectedAuth");
const specialAccess = require("../middleware/specialAccess");
const multer = require("../utils/multer");

router.post("/", protectedAuth, specialAccess(), multer.single("url"), assetController.createAsset);
router.delete("/:id", protectedAuth, specialAccess(), assetController.deleteAsset);

module.exports = router;