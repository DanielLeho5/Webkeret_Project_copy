const express = require("express");
const {
    listMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement
} = require("../controllers/measurementController");

const router = express.Router();

router.get("/", listMeasurements);
router.post("/", createMeasurement);
router.patch("/:id", updateMeasurement);
router.delete("/:id", deleteMeasurement);

module.exports = router;
