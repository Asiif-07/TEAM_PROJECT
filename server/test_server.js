import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.get('/test', (req, res) => res.json({ ok: true }));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
