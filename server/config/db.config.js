import mongoose from "mongoose";

const ensureDatabaseName = (rawUri) => {
    if (!rawUri) return rawUri;

    try {
        const parsed = new URL(rawUri);
        if (parsed.pathname && parsed.pathname !== "/") {
            return rawUri;
        }
    } catch {
        return rawUri;
    }

    // If URI already points to a specific DB, keep it unchanged.
    if (/\/[^/?]+(\?|$)/.test(rawUri.replace(/^mongodb(\+srv)?:\/\/[^/]+/, ""))) {
        return rawUri;
    }

    // Default database name instead of implicit "test".
    return `${rawUri.replace(/\/?$/, "")}/CurriculumVitAI`;
}

async function connectDB() {

    try {
        const dbUri = ensureDatabaseName(process.env.DB_URL);
        const connectionInstance = await mongoose.connect(dbUri)
        console.log(`DataBase connected: ${connectionInstance.connection.name} on ${connectionInstance.connection.host}:${connectionInstance.connection.port}`)

    } catch (error) {
        console.log(`failed to connect to DB`)
        process.exit(1)
    }
}

export default connectDB;