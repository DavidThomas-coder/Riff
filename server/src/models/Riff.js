const Model = require("./Model")

class Riff extends Model {
    static get tableName() {
        return "riffs"
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

module.exports = Riff