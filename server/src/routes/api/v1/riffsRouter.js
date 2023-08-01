import express from "express"
import { Riff } from "../../../models/index.js";

const riffsRouter = express.Router();

riffsRouter.get("/", async (req, res) => {
    try {
        const allRiffs = await Riff.query();
        return res.status(200).json({ riffs: allRiffs });
        } catch (error) {
        console.error("Error fetching all riffs:", error);
        return res.status(500).json({ error: "Internal Server Error" });
        }
});

// Endpoint to save a riff
riffsRouter.post("/", async (req, res) => {
    try {
        const { riffBody } = req.body;
        const riff = await Riff.query().insert({ riffBody });
        return res.status(201).json({ riff });
    } catch (error) {
        console.error("Error saving riff:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default riffsRouter
