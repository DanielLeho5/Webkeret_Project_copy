const MeasurementCategory = require("../models/MeasurementCategory");

async function listMeasurementCategories(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const categories = await MeasurementCategory.find({ createdBy: userId }).sort({ createdAt: -1 });
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({ message: "Failed to list measurement categories" });
    }
}

async function createMeasurementCategory(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, unit } = req.body;

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return res.status(400).json({ message: "Valid name is required" });
        }

        if (!unit || typeof unit !== "string" || unit.trim().length === 0) {
            return res.status(400).json({ message: "Valid unit is required" });
        }

        const newCategory = await MeasurementCategory.create({
            name: name.trim(),
            unit: unit.trim(),
            createdBy: userId
        });

        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ message: "Failed to create measurement category" });
    }
}

async function updateMeasurementCategory(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const { name, unit } = req.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
            return res.status(400).json({ message: "Invalid name" });
        }

        if (unit !== undefined && (typeof unit !== "string" || unit.trim().length === 0)) {
            return res.status(400).json({ message: "Invalid unit" });
        }

        const updateData = {};
        if (name) updateData.name = name.trim();
        if (unit) updateData.unit = unit.trim();

        const updatedCategory = await MeasurementCategory.findOneAndUpdate(
            { _id: id, createdBy: userId },
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Measurement category not found" });
        }

        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update measurement category" });
    }
}

async function deleteMeasurementCategory(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const deletedCategory = await MeasurementCategory.findOneAndDelete({ _id: id, createdBy: userId });

        if (!deletedCategory) {
            return res.status(404).json({ message: "Measurement category not found" });
        }

        return res.status(200).json({ message: "Measurement category deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete measurement category" });
    }
}

module.exports = {
    listMeasurementCategories,
    createMeasurementCategory,
    updateMeasurementCategory,
    deleteMeasurementCategory
};
