const express = require("express");
const Riff = require("../models/Riff");

const riffsRouter = express.Router();

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

module.exports = riffsRouter;
