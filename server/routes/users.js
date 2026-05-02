const express = require("express");
const {
    listUsers,
    getUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/", listUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
