const Model = require("./Model")

class Prompt extends Model {
    static get tableName() {
        return "prompts"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["promptBody"],
            properties: {
                promptBody: { type: "text" }
            }
        }
    }

}

module.exports = Prompt