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

riffsRouter.post("/", async (req, res) => {
    try {
      const { riffBody } = req.body;
      console.log("req.body is:", req.body)
      const userId = req.user.userId; // Assuming the authenticated user's ID is available in req.user
  
      // Insert the riff with the associated userId
      const riff = await Riff.query().insert({ riffBody, userId });
  
      return res.status(201).json({ riff });
    } catch (error) {
      console.error("Error saving riff:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default riffsRouter
