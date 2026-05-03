require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectToDB = require("./database/db")
const authenticateToken = require("./middleware/auth")
const { sanitizeRequestBody, setSecurityHeaders } = require("./middleware/security")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const measurementCategoryRoutes = require("./routes/measurement-categories")
const measurementRoutes = require("./routes/measurements")
const dailyListRoutes = require("./routes/daily-lists")
const dailyFoodListRoutes = require("./routes/daily-food-lists")

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: ["http://localhost:4200", "http://localhost:4201", "http://localhost:4202", "http://localhost:4206", "http://localhost:56695", "http://localhost:64928", "https://food-health-app-danleho.netlify.app"],
    credentials: true
}))
app.use(express.json())
app.use(setSecurityHeaders)
app.use(sanitizeRequestBody)

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// API info
app.get("/api", (req, res) => {
    res.status(200).json({
        message: "FoodHealthApp API",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users",
            "measurement-categories": "/api/measurement-categories",
            measurements: "/api/measurements",
            "daily-lists": "/api/daily-lists",
            "daily-food-lists": "/api/daily-food-lists"
        }
    })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", authenticateToken, userRoutes)
app.use("/api/measurement-categories", authenticateToken, measurementCategoryRoutes)
app.use("/api/measurements", authenticateToken, measurementRoutes)
app.use("/api/daily-lists", authenticateToken, dailyListRoutes)
app.use("/api/daily-food-lists", authenticateToken, dailyFoodListRoutes)

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Internal server error" })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Endpoint not found" })
})

connectToDB()
app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})