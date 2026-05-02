const mongoose = require("mongoose");

const { Schema } = mongoose;

const measurementCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        unit: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

measurementCategorySchema.index({ createdBy: 1 });

module.exports = mongoose.model("MeasurementCategory", measurementCategorySchema);
