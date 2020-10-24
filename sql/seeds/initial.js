exports.seed = (knex) => {
 /* const collectible = knex('collectible')
    .del()
    .then(() => {
        return knex('collectible').insert([
            { collectible_id: 1, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 2, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
            { collectible_id: 3, name: 'test', image_url: 'google.com', attributes: { color: 'green', style: 'cool' }, total_quantity: 445 },
        ]);
    });
*/
    const collector = knex('collector')
    .del()
    .then(() => {
        return knex('collector').insert([
            { collector_id: 1, username: 'test1', password: 'Pword123', email: 'test1@gmail.com', contact_email: 'test1@gmail.com', phone_number: '1234567', is_admin: false  }
        ]);
    });




    return Promise.all([
        //collectible,
        collector,
    ])
}

/*
exports.seed = (knex, Promise) => {
    return knex.raw('DELETE FROM "user"; ALTER SEQUENCE user_id_seq RESTART WITH 3')
    .then(() => {
        return knex('user').insert([
            {
                id: 1,
                email: 'berto.ort@gmail.com',
                password: 'pineapple',
                created_at: new Date()
            },
            {
                id: 2,
                email: 'hello@cjr.co.de',
                password: 'keyboard_cat',
                created_at: new Date()
            }
        ]);
    });

    }
    */