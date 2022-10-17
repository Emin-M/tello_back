const router = require("express").Router();
const protectedAuth = require("../middlewares/protectedAuth");
const specialAccess = require("../middlewares/specialAccess");
const multer = require("../utils/multer");
const assetController = require("../controller/assetController");

router.use(protectedAuth, specialAccess);
router.post("/", multer.single("url"), assetController.createAsset);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;