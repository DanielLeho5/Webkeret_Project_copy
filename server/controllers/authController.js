const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const scryptAsync = promisify(crypto.scrypt);
const PASSWORD_MIN_LENGTH = 8;

function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = await scryptAsync(password, salt, 64);
    return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
    if (!storedHash || !storedHash.includes(":")) {
        return false;
    }

    const [salt, keyHex] = storedHash.split(":");
    const storedKey = Buffer.from(keyHex, "hex");
    const derivedKey = await scryptAsync(password, salt, storedKey.length);

    return crypto.timingSafeEqual(storedKey, derivedKey);
}

async function login(req, res) {
    try {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "JWT secret is not configured" });
        }

        const token = jwt.sign(
            {
                sub: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
}

async function register(req, res) {
    try {
        const name = String(req.body.name || "").trim();
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || "");

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Email is invalid" });
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
            return res.status(400).json({
                message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const passwordHash = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: passwordHash,
            role: "user"
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        if (error && error.code === 11000) {
            return res.status(409).json({ message: "Email already in use" });
        }

        return res.status(500).json({ message: "Registration failed" });
    }
}

module.exports = {
    login,
    register
};
