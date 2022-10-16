const router = require("express").Router();
const assetController = require("../controller/assetController");
const multer = require("../utils/multer");

router.post("/", multer.single("url"), assetController.createAsset);
router.delete("/:id", assetController.deleteAsset);

module.exports = router;