const DailyFoodList = require("../models/DailyFoodList");

function validateFoodItem(item) {
    if (!item.name || typeof item.name !== "string") return false;
    if (!item.quantity || typeof item.quantity !== "number") return false;
    if (!item.unit || typeof item.unit !== "string") return false;
    return true;
}

async function listDailyFoodLists(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { startDate, endDate } = req.query;
        const query = { userId };

        if (startDate) {
            query.date = { $gte: new Date(startDate) };
        }
        if (endDate) {
            query.date = query.date || {};
            query.date.$lte = new Date(endDate);
        }

        const lists = await DailyFoodList.find(query).sort({ date: -1 });
        return res.status(200).json(lists);
    } catch (error) {
        return res.status(500).json({ message: "Failed to list daily food lists" });
    }
}

async function createDailyFoodList(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { date, foods } = req.body;

        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: "Valid date is required" });
        }

        if (!Array.isArray(foods)) {
            return res.status(400).json({ message: "Foods must be an array" });
        }

        for (const food of foods) {
            if (!validateFoodItem(food)) {
                return res.status(400).json({ message: "Invalid food item" });
            }
        }

        const newList = await DailyFoodList.create({
            userId,
            date: new Date(date),
            foods
        });

        return res.status(201).json(newList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create daily food list" });
    }
}

async function updateDailyFoodList(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const { date, foods } = req.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }

        if (foods && !Array.isArray(foods)) {
            return res.status(400).json({ message: "Foods must be an array" });
        }

        if (foods) {
            for (const food of foods) {
                if (!validateFoodItem(food)) {
                    return res.status(400).json({ message: "Invalid food item" });
                }
            }
        }

        const updateData = {};
        if (date) updateData.date = new Date(date);
        if (foods) updateData.foods = foods;

        const updatedList = await DailyFoodList.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedList) {
            return res.status(404).json({ message: "Daily food list not found" });
        }

        return res.status(200).json(updatedList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update daily food list" });
    }
}

async function deleteDailyFoodList(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const deletedList = await DailyFoodList.findOneAndDelete({ _id: id, userId });

        if (!deletedList) {
            return res.status(404).json({ message: "Daily food list not found" });
        }

        return res.status(200).json({ message: "Daily food list deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete daily food list" });
    }
}

module.exports = {
    listDailyFoodLists,
    createDailyFoodList,
    updateDailyFoodList,
    deleteDailyFoodList
};
