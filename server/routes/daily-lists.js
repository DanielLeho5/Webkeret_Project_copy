const express = require("express");
const {
    getDailyList,
    updateDailyList
} = require("../controllers/dailyListController");

const router = express.Router();

router.get("/", getDailyList);
router.put("/", updateDailyList);

module.exports = router;
