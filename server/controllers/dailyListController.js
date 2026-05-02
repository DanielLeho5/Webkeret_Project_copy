const DailyList = require("../models/DailyList");

async function getDailyList(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const dailyList = await DailyList.findOne({ userId }).populate("categories");
        if (!dailyList) {
            return res.status(404).json({ message: "Daily list not found" });
        }

        return res.status(200).json(dailyList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get daily list" });
    }
}

async function updateDailyList(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { categories, order } = req.body;

        if (!Array.isArray(categories)) {
            return res.status(400).json({ message: "Categories must be an array" });
        }

        // Validate that categories are valid ObjectIds
        for (const catId of categories) {
            if (!catId || !catId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
        }

        if (order !== undefined && typeof order !== "number") {
            return res.status(400).json({ message: "Order must be a number" });
        }

        const updatedList = await DailyList.findOneAndUpdate(
            { userId },
            { categories, order },
            { returnDocument: 'after', upsert: true, runValidators: true }
        ).populate("categories");

        return res.status(200).json(updatedList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update daily list" });
    }
}

module.exports = {
    getDailyList,
    updateDailyList
};
