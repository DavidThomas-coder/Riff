import express from "express";
import { Prompt } from "../../../models/index.js";

const promptsRouter = new express.Router();

let currentPrompt = null;

async function updateDailyPrompt() {
    try {
        // Fetch a new random prompt from the database
        const randomPrompt = await Prompt.query()
            .orderByRaw("RANDOM()")
            .limit(1)
            .first();

        if (!randomPrompt) {
            console.error("Error fetching random prompt: No prompts found");
            return;
        }

        // Update the current prompt
        currentPrompt = randomPrompt;
        console.log("Daily prompt updated:", currentPrompt);
    } catch (error) {
        console.error("Error updating daily prompt:", error);
    }
}

// Call the function to update the prompt on server start
updateDailyPrompt();

// Set up interval to update the prompt daily at midnight (UTC)
const midnight = new Date();
midnight.setUTCHours(24, 0, 0, 0); // Set time to midnight UTC
const timeUntilMidnight = midnight - Date.now();
setInterval(() => {
    updateDailyPrompt();
}, timeUntilMidnight);

promptsRouter.get("/", async (req, res) => {
    try {
        const allPrompts = await Prompt.query();
        return res.status(200).json({ prompts: allPrompts });
    } catch (error) {
        console.error("Error fetching all prompts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

promptsRouter.get("/current", (req, res) => {
    // Return the current prompt if available, or an empty response if no prompt has been set yet
    if (currentPrompt) {
        return res.status(200).json({ prompt: currentPrompt });
    } else {
        return res.status(204).send(); // No Content
    }
});

export default promptsRouter;




