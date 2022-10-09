const Category = require("../model/category");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Getting Categories
exports.getCategories = asyncCatch(async (req, res, next) => {
    const categories = await Category.find();

    //! categorizing the products
    function categorize(array, parent) {
        let newArray = [];

        for (let element in array) {
            if (array[element].p_id === parent) {
                let newObject = {};

                newObject._id = array[element]._id;
                newObject.parent_id = array[element].parent_id;
                newObject.slug = array[element].slug;
                newObject.name = array[element].name;
                newObject.description = array[element].description;
                newObject.assets = [];

                //! calling function again for collecting children
                let children = categorize(array, array[element].id);
                newObject.children = children;

                newArray = [...newArray, newObject];
            }
        };
        return newArray;
    };

    let data = categorize(categories, null);

    res.json({
        data: data,
        meta: {}
    });
});

//! Getting Category
exports.getCategory = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const categories = await Category.find();
    const category = await Category.findById(id);

    //! categorizing the products
    function categorize(array, parent) {
        let newArray = [];

        for (let element in array) {
            if (array[element].p_id === parent) {
                let newObject = {};

                newObject._id = array[element]._id;
                newObject.parent_id = array[element].parent_id;
                newObject.slug = array[element].slug;
                newObject.name = array[element].name;
                newObject.description = array[element].description;
                newObject.assets = [];

                //! calling function again for collecting children
                let children = categorize(array, array[element].id);
                newObject.children = children;

                newArray = [...newArray, newObject];
            }
        };
        return newArray;
    };

    let data = categorize(categories, category.id);

    //! creating new object from "category" for adding children(data) to it
    const newCategory = {
        _id: category._id,
        parent_id: category.parent_id,
        slug: category.slug,
        name: category.name,
        description: category.description,
        assets: []
    };
    newCategory.children = data;

    res.status(200).json({
        data: newCategory,
        meta: {}
    });
});

//! Creating Category
exports.createCategory = asyncCatch(async (req, res, next) => {
    const category = await Category.create({
        name: req.body.name,
        slug: req.body.slug,
        id: req.body.id,
        p_id: req.body.p_id,
        parent_id: req.body.parent_id,
        description: req.body.description,
    });

    res.status(200).json({
        success: true,
        data: category
    });
});

//! Updating Category
exports.updateCategory = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
        new: true
    });

    if (!updatedCategory) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        data: updatedCategory
    });
});

//! Deleting Category
exports.deleteCategory = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        message: "document deleted!"
    });
});