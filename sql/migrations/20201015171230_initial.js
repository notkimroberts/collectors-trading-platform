exports.up = (knex) => {

    const collectible = knex.schema.createTable('collectible', (table) => {
        table.bigIncrements('collectible_id');
        table.bigInteger('collectible_type_id');    // FK
        table.text('name', 128).notNullable();
        table.text('image_url', 128).notNullable();
        table.jsonb('attributes');
        table.bigInteger('total_quantity');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
        table
            .foreign('collectible_type_id')
            .references('collectible_type.collectible_type_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })

    const collectible_type = knex.schema.createTable('collectible_type', (table) => {
        table.bigIncrements('collectible_type_id');
        table.text('name', 128).notNullable();
        table.bigInteger('release_year');
        table.text('attribute_template', 128).notNullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
    })

    const collection = knex.schema.createTable('collection', (table) => {
        table.bigInteger('collector_id');       // FK
        table.bigInteger('collectible_id');     // FK
        table.bigInteger('has_quantity');
        table.bigInteger('willing_to_trade_quantity');
        table.bigInteger('wants_quantity');
        table
            .foreign('collector_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table
            .foreign('collectible_id')
            .references('collectible.collectible_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })

    const collector = knex.schema.createTable('collector', (table) => {
        table.bigIncrements('collector_id');
        table.text('username', 128).notNullable();
        table.text('password', 128).notNullable();
        table.text('email', 128).notNullable();
        table.text('phone_number', 128).notNullable();
        table.boolean('has_public').defaultTo(true);
        table.boolean('wants_public').defaultTo(true);
        table.boolean('is_admin').defaultTo(false);
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
    })

    const collector_ratings = knex.schema.createTable('collector_ratings', (table) => {
        table.bigInteger('from_user_id');
        table.bigInteger('to_user_id');
        table.bigInteger('rating');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
        table
            .foreign('from_user_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table
            .foreign('to_user_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })

    const followers = knex.schema.createTable('followers', (table) => {
        table.bigInteger('collector_id');           // FK
        table.bigInteger('following_collector_id'); // FK
        table
            .foreign('collector_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table
            .foreign('following_collector_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })

    const match = knex.schema.createTable('match', (table) => {
        table.bigIncrements('match_id');
        table.bigInteger('from_collector_id');  // FK
        table.bigInteger('to_collector_id');    // FK
        table.bigInteger('collectible_id');     // FK
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.boolean('match_executed').defaultTo(false);
        table
            .foreign('from_collector_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table
            .foreign('to_collector_id')
            .references('collector.collector_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table
            .foreign('collectible_id')
            .references('collectible.collectible_id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
    })


    // Note: order matters here.
    return Promise.all([
        collector,
        collectible,
        collectible_type,
        collection,
        collector_ratings,
        followers,
        match,
    ])
}

exports.down = (knex) => {
    const collectible = knex.schema.dropTable('collectible')
    const collectible_type = knex.schema.dropTable('collectible_type')
    const collection = knex.schema.dropTable('collection')
    const collector = knex.schema.dropTable('collector')
    const collector_ratings = knex.schema.dropTable('collector_ratings')
    const followers = knex.schema.dropTable('followers')
    const match = knex.schema.dropTable('match')

    // Note: order matters here.
    return Promise.all([
        collector_ratings,
        followers,
        match,
        collection,
        collectible,
        collector,
        collectible_type,
    ])
}

