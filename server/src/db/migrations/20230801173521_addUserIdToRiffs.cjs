/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    return knex.schema.alterTable("riffs", (table) => {
        table
        .bigInteger("userId")
        .unsigned()
        .notNullable()
        .index()
        .references("users.id")
    table
        .bigInteger("promptId")
        .unsigned()
        .notNullable()
        .index()
        .references("prompts.id")
    })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
    return knex.schema.alterTable("riffs", (table) => {
        table.dropColumn("userId")
        table.dropColumn("promptId")
    })
}
