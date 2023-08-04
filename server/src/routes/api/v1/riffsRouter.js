import express from "express";
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

riffsRouter.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        // Fetch the riff associated with the given user ID
        const userRiff = await Riff.query().findOne({ userId });

        if (userRiff) {
            return res.status(200).json({ riff: userRiff });
        } else {
            // If the user has not submitted a riff yet, return an empty response or a default value
            return res.status(200).json({ riff: null });
        }
    } catch (error) {
        console.error("Error fetching user's riff:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

riffsRouter.post("/", async (req, res) => {
    try {
        const { riffBody, userId, promptId } = req.body;
        console.log("req.body is:", req.body);
        // const userId = req.user.userId; // Assuming the authenticated user's ID is available in req.user

        // Insert the riff with the associated userId
        const riff = await Riff.query().insert({ riffBody, userId, promptId });

        return res.status(201).json({ riff });
    } catch (error) {
        console.error("Error saving riff:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export default riffsRouter;