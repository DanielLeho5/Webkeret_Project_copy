const Measurement = require("../models/Measurement");

async function listMeasurements(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { categoryId, startDate, endDate } = req.query;
        const query = { userId };

        if (categoryId) {
            if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            query.categoryId = categoryId;
        }

        if (startDate) {
            query.date = { $gte: new Date(startDate) };
        }
        if (endDate) {
            query.date = query.date || {};
            query.date.$lte = new Date(endDate);
        }

        const measurements = await Measurement.find(query)
            .populate("categoryId")
            .sort({ date: -1 });

        return res.status(200).json(measurements);
    } catch (error) {
        return res.status(500).json({ message: "Failed to list measurements" });
    }
}

async function createMeasurement(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { categoryId, value, date, unit } = req.body;

        if (!categoryId || !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Valid category ID is required" });
        }

        if (typeof value !== "number" || value < 0) {
            return res.status(400).json({ message: "Valid value is required" });
        }

        if (!unit || typeof unit !== "string" || !unit.trim()) {
            return res.status(400).json({ message: "Valid unit is required" });
        }

        if (!date || isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: "Valid date is required" });
        }

        const newMeasurement = await Measurement.create({
            userId,
            categoryId,
            value,
            unit: unit.trim(),
            date: new Date(date)
        });

        return res.status(201).json(await newMeasurement.populate("categoryId"));
    } catch (error) {
        return res.status(500).json({ message: "Failed to create measurement" });
    }
}

async function updateMeasurement(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const { categoryId, value, date, unit } = req.body;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (categoryId && !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        if (value !== undefined && (typeof value !== "number" || value < 0)) {
            return res.status(400).json({ message: "Invalid value" });
        }

        if (unit !== undefined && (typeof unit !== "string" || !unit.trim())) {
            return res.status(400).json({ message: "Invalid unit" });
        }

        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({ message: "Invalid date" });
        }

        const updateData = {};
        if (categoryId) updateData.categoryId = categoryId;
        if (value !== undefined) updateData.value = value;
        if (unit !== undefined) updateData.unit = unit.trim();
        if (date) updateData.date = new Date(date);

        const updatedMeasurement = await Measurement.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { returnDocument: 'after', runValidators: true }
        ).populate("categoryId");

        if (!updatedMeasurement) {
            return res.status(404).json({ message: "Measurement not found" });
        }

        return res.status(200).json(updatedMeasurement);
    } catch (error) {
        return res.status(500).json({ message: "Failed to update measurement" });
    }
}

async function deleteMeasurement(req, res) {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const deletedMeasurement = await Measurement.findOneAndDelete({ _id: id, userId });

        if (!deletedMeasurement) {
            return res.status(404).json({ message: "Measurement not found" });
        }

        return res.status(200).json({ message: "Measurement deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete measurement" });
    }
}

module.exports = {
    listMeasurements,
    createMeasurement,
    updateMeasurement,
    deleteMeasurement
};
