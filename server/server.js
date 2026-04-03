import app from "./app.js";
import connectDB from "./config/db.config.js";

const PORT = process.env.PORT || 1000;

connectDB()

    .then(() => {
        app.listen(PORT, () => {

            console.log(`Server is running on port ${PORT}`);

        });
    })
    .catch((error) => {
        console.error('Error starting server:', error);
        process.exit(1);
    })

