import express from "express";
import { Prompt } from "../../../models/index.js";

const promptsRouter = new express.Router();

let currentPrompt = null;
let promptTimestamp = null;

function updateDailyPrompt() {
    // Fetch a new random prompt from the database
    // Assuming the following query function returns a random prompt object
    // Replace "Prompt" with the actual name of your prompt model
    Prompt.query()
        .orderByRaw("RANDOM()")
        .limit(1)
        .then((randomPrompt) => {
            if (!randomPrompt) {
                console.error("Error fetching random prompt: No prompts found");
                return;
            }

            // Update the current prompt and timestamp
            currentPrompt = randomPrompt;
            promptTimestamp = Date.now();
        })
        .catch((error) => {
            console.error("Error fetching random prompt:", error);
        });
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
    if (currentPrompt && promptTimestamp) {
        return res.status(200).json({ prompt: currentPrompt });
    } else {
        return res.status(204).send(); // No Content
    }
});

export default promptsRouter;



