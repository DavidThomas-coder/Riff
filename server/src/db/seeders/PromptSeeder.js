import { Prompt } from "../../models/index.js";

class PromptSeeder {
    static async seed() {
        const promptsData = [
            {
                promptBody: "Describe your first date."
            },
            {
                promptBody: "Tell a story that comes up at every family gathering.  It could be one that you've told 100 times."
            },
            {
                promptBody: "What's the most embarrassing thing to happen to you recently?"
            },
            {
                promptBody: "If you could have any superpower, what would it be and why?"
            }
        ]

        for (const singlePromptData of promptsData) {
            const currentPrompt= await Prompt.query().findOne({ promptBody: singlePromptData.promptBody })
            if (!currentPrompt) {
                await Prompt.query().insert(singlePromptData)
            }
        }
    }
}

export default PromptSeeder