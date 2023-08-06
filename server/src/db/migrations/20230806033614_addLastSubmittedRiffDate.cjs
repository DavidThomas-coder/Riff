/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("users", (table) => {
        table.date("lastSubmittedRiffDate")
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("lastSubmittedRiffDate")
    })
}
