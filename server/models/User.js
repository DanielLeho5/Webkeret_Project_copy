const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"]
        }
    },
    { timestamps: true }
);

userSchema.index({ createdAt: 1 });

module.exports = mongoose.model("User", userSchema);
