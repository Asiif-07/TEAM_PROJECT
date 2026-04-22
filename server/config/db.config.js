import mongoose from "mongoose";

async function connectDB() {

    try {
        const connectionInstance = await mongoose.connect(process.env.ATLAS_URI)
        console.log(`DataBase connected: ${connectionInstance.connection.name} on ${connectionInstance.connection.host}:${connectionInstance.connection.port}`)

    } catch (error) {
        console.log(`failed to connect to DB`)
        process.exit(1)
    }
}

export default connectDB;