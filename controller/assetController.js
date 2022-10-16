const Asset = require("../model/asset");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const cloudinary = require("../utils/cloudinary");


//! Create Asset
exports.createAsset = asyncCatch(async (req, res, next) => {
    const asset = await Asset.create({
        filename: req.body.filename,
        description: req.body.description
    });

    //! loading image to cloud
    let image;
    if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
    };

    await asset.updateOne({
        url: image.secure_url,
        url_id: image.public_id,
    });
    asset.url = image.secure_url;
    asset.url_id = image.public_id;

    res.status(200).json(asset);
});

//! Delete Asset
exports.deleteAsset = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const asset = await Asset.findById(id);

    if (!asset) return next(new GlobalError("Invalid ID", 404));

    asset.delete();

    //! deleting image from cloud
    if (asset.url_id) {
        await cloudinary.uploader.destroy(asset.url_id);
    };

    res.status(200).json({
        success: true,
        message: "Document deleted!"
    });
});