const mongoose = require("mongoose");

const { Schema } = mongoose;

const dailyListSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "MeasurementCategory",
                required: true
            }
        ],
        order: {
            type: Number
        }
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

dailyListSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("DailyList", dailyListSchema);
