const mongoose = require("mongoose")

async function connectToDB() {
    try {
        if (!process.env.MONGO_CONN) {
            throw new Error("MONGO_CONN is not set")
        }
        await mongoose.connect(process.env.MONGO_CONN)
        console.log("Succesfully connected to database!")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectToDB