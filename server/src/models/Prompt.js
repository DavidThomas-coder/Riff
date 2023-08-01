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
                promptBody: { type: "string" }
            }
        }
    }

    static get relationMappings() {
        const { Riff } = require("./index.js")
        return {
            prompts: {
                relation: Model.HasManyRelation,
                modelClass: Prompt,
                join: {
                    from: "prompts.id",
                    to: "riffs.promptId"
                }
            }
        }
    }

}

module.exports = Prompt