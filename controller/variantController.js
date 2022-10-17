const Variant = require("../model/variant");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Getting All Variants
exports.getAllvariants = asyncCatch(async (req, res) => {
    const id = req.params.id;
    const variants = await Variant.find({
        parenttId: id
    });

    res.status(200).json(variants);
});

//! Getting Variant By VariantId
exports.getVariant = asyncCatch(async (req, res) => {
    const id = req.params.varintId;
    const variant = await Variant.findById(id);

    res.status(200).json(variant);
});