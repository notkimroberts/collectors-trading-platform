// TODO: Sample table, to be deleted.
exports.up = knex =>
    knex.schema.createTable("todo", table => {
        table.increments();
        table.text("task", 128).notNullable();
});

exports.down = knex => knex.schema.dropTableIfExists("todo");
