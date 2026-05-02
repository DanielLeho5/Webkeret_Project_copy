const User = require("../models/User");
const { hashPassword, isValidEmail } = require("./authController"); // Import helpers

async function listUsers(req, res) {
    try {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId || role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Failed to list users" });
    }
}

async function getUser(req, res) {
    try {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        let targetUserId = id;

        if (id === "me") {
            targetUserId = userId;
        }

        if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (role !== "admin" && targetUserId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(targetUserId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get user" });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        let targetUserId = id;

        if (id === "me") {
            targetUserId = userId;
        }

        if (!targetUserId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        if (role !== "admin" && targetUserId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { email, password, role: newRole } = req.body;

        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email" });
        }

        if (password && password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        if (newRole && role !== "admin") {
            return res.status(403).json({ message: "Cannot change role" });
        }

        if (newRole && !["user", "admin"].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const updateData = {};
        if (email) updateData.email = email.trim().toLowerCase();
        if (password) updateData.password = await hashPassword(password);
        if (newRole) updateData.role = newRole;

        const updatedUser = await User.findByIdAndUpdate(
            targetUserId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email already in use" });
        }
        return res.status(500).json({ message: "Failed to update user" });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.user?.sub;
        const role = req.user?.role;
        if (!userId || role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete user" });
    }
}

module.exports = {
    listUsers,
    getUser,
    updateUser,
    deleteUser
};
