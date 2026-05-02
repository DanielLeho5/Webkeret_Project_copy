const mongoose = require("mongoose");

const { Schema } = mongoose;

const measurementSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "MeasurementCategory",
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

measurementSchema.index({ userId: 1, date: 1 });
measurementSchema.index({ userId: 1 });

module.exports = mongoose.model("Measurement", measurementSchema);
