const mongoose = require("mongoose");

const { Schema } = mongoose;

const foodItemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true,
            trim: true
        },
        calories: {
            type: Number
        },
        protein: {
            type: Number
        },
        carbs: {
            type: Number
        },
        fat: {
            type: Number
        }
    },
    { _id: true }
);

const dailyFoodListSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        foods: [foodItemSchema]
    },
    { timestamps: true }
);

dailyFoodListSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("DailyFoodList", dailyFoodListSchema);
