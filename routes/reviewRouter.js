const router = require("express").Router({
    mergeParams: true
});
const protectedAuth = require("../middlewares/protectedAuth");
const reviewController = require("../controller/reviewController");

router.get("/", reviewController.getReviews);

router.use(protectedAuth);
router.post("/", reviewController.createReview);
router.delete("/:reviewId", reviewController.deleteReview);

module.exports = router;