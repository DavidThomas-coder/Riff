import express from "express";
import passport from "passport";
import { User, Prompt } from "../../../models/index.js"

const promptsRouter = new express.Router()

promptsRouter.get("/", async (req, res) => {
    try {
        const allPrompts = await Prompt.query()
        return res.status(200).json({ prompts: allPrompts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
})

export default promptsRouter

