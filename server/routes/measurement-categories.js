const express = require("express");
const {
    listMeasurementCategories,
    createMeasurementCategory,
    updateMeasurementCategory,
    deleteMeasurementCategory
} = require("../controllers/measurementCategoryController");

const router = express.Router();

router.get("/", listMeasurementCategories);
router.post("/", createMeasurementCategory);
router.patch("/:id", updateMeasurementCategory);
router.delete("/:id", deleteMeasurementCategory);

module.exports = router;
