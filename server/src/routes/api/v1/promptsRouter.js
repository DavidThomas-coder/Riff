import express from "express";
import { Prompt } from "../../../models/index.js";

const promptsRouter = new express.Router();

promptsRouter.get("/", async (req, res) => {
    try {
        const allPrompts = await Prompt.query();
        return res.status(200).json({ prompts: allPrompts });
        } catch (error) {
        console.error("Error fetching all prompts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
        }
});

// let dailyPrompt = null; // Variable to store the daily prompt

// const fetchDailyPrompt = async () => {
//     try {
//         // If the daily prompt is already set, return it
//         if (dailyPrompt) {
//         return dailyPrompt;
//         }

//         // If the daily prompt is not set, fetch a random prompt from the database
//         const allPrompts = await Prompt.query();
//         if (allPrompts && allPrompts.length > 0) {
//         const randomIndex = Math.floor(Math.random() * allPrompts.length);
//         dailyPrompt = allPrompts[randomIndex].promptBody;
//         return dailyPrompt;
//         }

//         // If there are no prompts in the database, return a default prompt
//         const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
//         dailyPrompt = defaultPrompt;
//         return dailyPrompt;
//     } catch (error) {
//         console.error("Error fetching prompts:", error);
//         // If an error occurs while fetching prompts, return a default prompt
//         const defaultPrompt = "Welcome to the daily prompt! Answer this question...";
//         dailyPrompt = defaultPrompt;
//         return dailyPrompt;
//     }
//     };

//     promptsRouter.get("/", async (req, res) => {
//     try {
//         const prompt = await fetchDailyPrompt();
//         return res.status(200).json({ prompt });
//     } catch (error) {
//         console.error("Error fetching daily prompt:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// });

export default promptsRouter;


