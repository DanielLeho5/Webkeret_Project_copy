const express = require("express");
const {
    listDailyFoodLists,
    createDailyFoodList,
    updateDailyFoodList,
    deleteDailyFoodList
} = require("../controllers/dailyFoodListController");

const router = express.Router();

router.get("/", listDailyFoodLists);
router.post("/", createDailyFoodList);
router.patch("/:id", updateDailyFoodList);
router.delete("/:id", deleteDailyFoodList);

module.exports = router;
