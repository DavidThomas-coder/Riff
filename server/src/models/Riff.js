const Model = require("./Model")

class Riff extends Model {
    static get tableName() {
        return "riffs"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["riffBody"],
            properties: {
                riffBody: { type: "string" }
            }
        }
    }

    static get relationMappings() {
        const {Prompt, User} = require("./index.js")

        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: "riffs.userId",
                    to: "users.id"
                }
            },
            prompts: {
                relation: Model.BelongsToOneRelation,
                modelClass: Prompt,
                join: {
                    from: "riffs.promptId",
                    to: "prompts.id"
                }
            }
        }
    }

}

module.exports = Riff