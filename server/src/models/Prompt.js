const Model = require("./Model")

class Prompt extends Model {
    static get tableName() {
        return "prompts"
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["body"],
            properties: {
                body: {type: "text"}
            }
        }
    }

    // static get relationMappings() {
    //     const {}
    // }

}

module.exports = Prompt