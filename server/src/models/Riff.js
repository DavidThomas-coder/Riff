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
                riffBody: { type: "text" }
            }
        }
    }

}

module.exports = Riff